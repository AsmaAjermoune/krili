"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  getOwnerStats,
  getOwnerLocations,
  getStatutLabel,
  formatPrice,
  getMaterielImage,
  getMyMateriels,
  acceptLocation,
  rejectLocation,
} from "@/lib/api";
import { Package, Download, Plus } from "lucide-react";

interface OwnerStats {
  totalMateriels: number;
  disponibiles: number;
  locations: { enAttente: number; acceptees: number; enCours: number; terminees: number; total: number };
  revenus: number;
}

interface Location {
  _id: string;
  materielId: { _id: string; nom: string; photos?: { url: string }[]; localisation?: string };
  locataireId: { _id: string; nom: string; email?: string; telephone?: string };
  dateDebut: string;
  dateFinPrevue: string;
  nbJours?: number;
  statut: string;
  montantLocation: number;
}

interface Materiel {
  _id: string;
  nom: string;
  photos?: { url: string }[];
  disponible?: boolean;
  prixParJour?: number;
  localisation?: string;
  statut?: string;
  nombreLocations?: number;
}

const SIGNAL = "var(--lm-signal)";
const INK = "var(--lm-ink)";
const BONE = "var(--lm-bone)";
const LINE = "var(--lm-line)";
const MID = "var(--lm-mid)";
const CHAR = "var(--lm-char)";
const OK = "var(--lm-ok)";
const OK_SOFT = "var(--lm-ok-soft)";
const WARN = "var(--lm-warn)";
const WARN_SOFT = "var(--lm-warn-soft)";
const INVERTED = "var(--lm-surface-inverted)";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  en_attente: { bg: WARN_SOFT, color: WARN },
  acceptee:   { bg: OK_SOFT,   color: OK },
  en_cours:   { bg: "#DDEEFF", color: "#1A4B8F" },
  terminee:   { bg: "rgba(10,10,9,0.06)", color: MID },
  refusee:    { bg: "#F6D6D2", color: "#B0241A" },
  annulee:    { bg: "rgba(10,10,9,0.04)", color: "#A8A8A6" },
};

// Mock bar chart data (% of max)
const CHART_BARS = [38, 52, 46, 64, 58, 72, 68, 80, 76, 88, 94, 84];

export default function ProprietaireDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, locationsData, materielsData] = await Promise.all([
          getOwnerStats(),
          getOwnerLocations({ statut: "en_attente", limit: 4 }),
          getMyMateriels({ limit: 4 }),
        ]);
        setStats(statsData);
        setLocations(locationsData.data);
        setMateriels(materielsData.data);
      } catch {
        // silently handled
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleAct(id: string, action: "accept" | "reject") {
    setActing(id);
    try {
      if (action === "accept") await acceptLocation(id);
      else await rejectLocation(id);
      const fresh = await getOwnerLocations({ statut: "en_attente", limit: 4 });
      setLocations(fresh.data);
      const freshStats = await getOwnerStats();
      setStats(freshStats);
    } catch {
      // handled silently
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px 48px", maxWidth: 1200 }}>
        <div style={{ height: 36, width: 320, borderRadius: 8, background: "rgba(10,10,9,0.06)", marginBottom: 40, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 160, borderRadius: 28, background: "rgba(10,10,9,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
        <div style={{ height: 340, borderRadius: 28, background: "rgba(10,10,9,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    );
  }

  const firstName = user?.nom?.split(" ")[0] ?? "vous";
  const pending = stats?.locations.enAttente ?? 0;
  const currentMonth = new Date().toLocaleDateString("fr-MA", { month: "long", year: "numeric" }).toUpperCase();
  const totalMateriels = stats?.totalMateriels ?? 0;
  const disponibles = stats?.disponibiles ?? 0;
  const enLocation = (stats?.locations.acceptees ?? 0) + (stats?.locations.enCours ?? 0);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1200 }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <div className="lm-eyebrow" style={{ marginBottom: 12 }}>
            {currentMonth} · {totalMateriels} MATÉRIEL{totalMateriels !== 1 ? "S" : ""} · {formatPrice(stats?.revenus ?? 0)} ENCAISSÉS
          </div>
          <h1 style={{
            fontFamily: "var(--lm-f-display, 'Inter Tight', sans-serif)",
            fontSize: "clamp(40px, 4.5vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 0.95,
            color: INK,
            margin: 0,
          }}>
            Bienvenue, {firstName}.<br />
            <span style={{ color: SIGNAL }}>
              {pending > 0
                ? `${pending} demande${pending > 1 ? "s" : ""} ce matin.`
                : "Tout est à jour."}
            </span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingTop: 8 }}>
          <button
            onClick={() => window.print()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              height: 36, padding: "0 16px", borderRadius: 999,
              background: "transparent", color: CHAR,
              border: `1px solid ${LINE.replace("0.08", "0.16")}`,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            <Download size={14} /> Rapport
          </button>
          <Link
            href="/dashboard/proprietaire/ajouter"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              height: 36, padding: "0 16px", borderRadius: 999,
              background: SIGNAL, color: "#FFFFFF",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}
          >
            <Plus size={14} /> Mettre en location
          </Link>
        </div>
      </div>

      {/* ── KPI grid ───────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Featured dark card */}
        <div style={{
          background: INVERTED, color: "var(--lm-ink)",
          borderRadius: 28, padding: "32px 36px",
          position: "relative", overflow: "hidden",
          border: "1px solid var(--lm-line-strong)",
        }}>
          <div style={{
            position: "absolute", top: "-30%", right: "-10%",
            width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${SIGNAL} 0%, transparent 65%)`,
            opacity: 0.30, filter: "blur(40px)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div className="lm-eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>REVENU NET · TOTAL</div>
            <div className="lm-mega" style={{ fontSize: "clamp(52px, 5vw, 88px)", marginTop: 12, color: "#FFFFFF" }}>
              {(stats?.revenus ?? 0).toLocaleString("fr-MA")}
              <span style={{ fontSize: 22, color: "rgba(255,255,255,0.5)", fontFamily: "var(--lm-f-mono, monospace)", fontWeight: 500, marginLeft: 8 }}>DH</span>
            </div>
            <div style={{
              marginTop: 12,
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              fontSize: 12.5,
            }}>
              <span style={{ color: "var(--lm-signal)" }}>↑ Croissance</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{stats?.locations.terminees ?? 0} location{(stats?.locations.terminees ?? 0) !== 1 ? "s" : ""} terminée{(stats?.locations.terminees ?? 0) !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* KPI: Matériels */}
        <KpiCard
          eyebrow="MATÉRIELS"
          value={String(totalMateriels)}
          sub={`${disponibles} disponible${disponibles !== 1 ? "s" : ""}`}
          subColor={OK}
        />

        {/* KPI: En location */}
        <KpiCard
          eyebrow="EN LOCATION"
          value={String(enLocation)}
          sub={`${pending} en attente`}
          subColor={pending > 0 ? SIGNAL : MID}
        />

        {/* KPI: Demandes totales */}
        <KpiCard
          eyebrow="TOTAL DEMANDES"
          value={String(stats?.locations.total ?? 0)}
          sub={`${stats?.locations.terminees ?? 0} terminée${(stats?.locations.terminees ?? 0) !== 1 ? "s" : ""}`}
          subColor={MID}
        />
      </div>

      {/* ── Chart + Demands ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20, marginBottom: 24 }}>

        {/* Chart */}
        <div style={{
          background: "var(--lm-surface-card)", border: `1px solid ${LINE}`,
          borderRadius: 28, padding: 28,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em", color: INK, margin: 0 }}>Revenus & volume</h3>
              <div className="lm-mono" style={{ fontSize: 11, color: MID, marginTop: 6 }}>12 DERNIÈRES SEMAINES</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["7j", "30j", "12s", "3m", "1a"].map((t, i) => (
                <button key={t} style={{
                  fontSize: 12, padding: "6px 12px", borderRadius: 999,
                  background: i === 2 ? INK : "transparent",
                  color: i === 2 ? "#FFFFFF" : CHAR,
                  border: `1px solid ${i === 2 ? "transparent" : LINE.replace("0.08", "0.16")}`,
                  cursor: "pointer", fontFamily: "inherit",
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", height: 200, padding: "0 4px" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                position: "absolute", left: 0, right: 0,
                top: `${(i / 3) * 100}%`, height: 1,
                background: "rgba(10,10,9,0.04)",
              }}>
                <span className="lm-mono" style={{
                  position: "absolute", right: 0, top: -8, fontSize: 10, color: MID,
                }}>{[12000, 8000, 4000, 0][i].toLocaleString("fr-FR")}</span>
              </div>
            ))}
            <div style={{
              position: "absolute", inset: 0, paddingRight: 50,
              display: "flex", alignItems: "flex-end", gap: 6,
            }}>
              {CHART_BARS.map((v, i) => {
                const isCurrent = i === CHART_BARS.length - 1;
                return (
                  <div key={i} style={{ flex: 1, position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{
                      height: `${v}%`,
                      background: isCurrent ? SIGNAL : INK,
                      borderRadius: "5px 5px 0 0",
                      position: "relative",
                    }}>
                      {isCurrent && (
                        <div style={{
                          position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
                          background: INK, color: "#FFFFFF",
                          padding: "4px 8px", borderRadius: 6,
                          fontSize: 10, fontFamily: "var(--lm-f-mono, monospace)", whiteSpace: "nowrap",
                        }}>{formatPrice(stats?.revenus ?? 0)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 32, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${LINE}` }}>
            {[
              ["MAT. LE + LOUÉ", `${totalMateriels} total`, `${enLocation} actif${enLocation !== 1 ? "s" : ""}`],
              ["EN ATTENTE", `${pending} demande${pending !== 1 ? "s" : ""}`, pending > 0 ? "À traiter" : "Aucune"],
              ["TAUX ACCEPTATION", stats?.locations.total ? `${Math.round(((stats.locations.acceptees + stats.locations.enCours + stats.locations.terminees) / stats.locations.total) * 100)}%` : "—", "des demandes"],
            ].map(([k, v, n]) => (
              <div key={k} style={{ flex: 1 }}>
                <div className="lm-eyebrow">{k}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8, letterSpacing: "-0.015em", color: INK }}>{v}</div>
                <div className="lm-mono" style={{ fontSize: 12, color: SIGNAL, marginTop: 4 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Demands */}
        <div style={{
          background: "var(--lm-surface-card)", border: `1px solid ${LINE}`,
          borderRadius: 28, overflow: "hidden",
        }}>
          <div style={{
            padding: "20px 24px", borderBottom: `1px solid ${LINE}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: INK, margin: 0 }}>Demandes</h3>
              {pending > 0 && (
                <span style={{
                  background: SIGNAL, color: "#FFFFFF",
                  padding: "3px 9px", borderRadius: 999,
                  fontFamily: "var(--lm-f-mono, monospace)", fontSize: 11,
                }}>{pending}</span>
              )}
            </div>
            <Link href="/dashboard/proprietaire/locations" style={{
              background: "none", border: "none", color: MID,
              fontSize: 12, cursor: "pointer", fontFamily: "var(--lm-f-mono, monospace)",
              letterSpacing: "0.04em", textDecoration: "none",
            }}>TOUT VOIR</Link>
          </div>

          {locations.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: MID }}>Aucune demande en attente</div>
            </div>
          ) : (
            locations.map((loc, i) => {
              const start = new Date(loc.dateDebut).toLocaleDateString("fr-MA", { day: "numeric", month: "short" });
              const end = new Date(loc.dateFinPrevue).toLocaleDateString("fr-MA", { day: "numeric", month: "short" });
              const days = loc.nbJours ?? Math.ceil((new Date(loc.dateFinPrevue).getTime() - new Date(loc.dateDebut).getTime()) / 86400000);
              return (
                <div key={loc._id} style={{
                  padding: "18px 24px",
                  borderTop: i > 0 ? `1px solid ${LINE}` : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>{loc.locataireId?.nom}</span>
                      </div>
                      <div style={{ fontSize: 13, color: CHAR, marginTop: 4 }}>{loc.materielId?.nom}</div>
                      <div className="lm-mono" style={{ fontSize: 11, color: MID, marginTop: 4 }}>
                        {start} → {end} · {days}j · {formatPrice(loc.montantLocation)}
                      </div>
                    </div>
                    <div className="lm-mono" style={{ fontSize: 11, color: MID, flexShrink: 0 }}>
                      {getStatutLabel(loc.statut)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    <button
                      onClick={() => handleAct(loc._id, "accept")}
                      disabled={acting === loc._id}
                      style={{
                        flex: 1, height: 32, borderRadius: 999, border: "none",
                        background: SIGNAL, color: "#FFFFFF",
                        fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                        opacity: acting === loc._id ? 0.6 : 1,
                      }}
                    >Accepter</button>
                    <button
                      onClick={() => handleAct(loc._id, "reject")}
                      disabled={acting === loc._id}
                      style={{
                        height: 32, padding: "0 14px", borderRadius: 999,
                        background: "transparent", color: CHAR,
                        border: `1px solid rgba(10,10,9,0.16)`,
                        fontSize: 12.5, cursor: "pointer",
                        opacity: acting === loc._id ? 0.6 : 1,
                      }}
                    >Refuser</button>
                  </div>
                </div>
              );
            })
          )}

          {locations.length > 0 && (
            <div style={{ padding: "14px 24px", borderTop: `1px solid ${LINE}`, background: BONE }}>
              <Link href="/dashboard/proprietaire/locations" style={{ fontSize: 12, color: MID, fontFamily: "var(--lm-f-mono, monospace)", textDecoration: "none" }}>
                VOIR TOUTES LES DEMANDES →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Mes matériels ───────────────────────────────────────── */}
      <div style={{
        background: "var(--lm-surface-card)", border: `1px solid ${LINE}`,
        borderRadius: 28, overflow: "hidden",
      }}>
        <div style={{
          padding: "24px 28px", borderBottom: `1px solid ${LINE}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em", color: INK, margin: 0 }}>
              Mon parc · {totalMateriels} matériel{totalMateriels !== 1 ? "s" : ""}
            </h3>
            <div className="lm-mono" style={{ fontSize: 11, color: MID, marginTop: 6 }}>
              {disponibles} DISPONIBLE{disponibles !== 1 ? "S" : ""} · {enLocation} EN LOCATION
            </div>
          </div>
          <Link
            href="/dashboard/proprietaire/materiels"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              height: 36, padding: "0 16px", borderRadius: 999,
              background: "transparent", color: CHAR,
              border: `1px solid rgba(10,10,9,0.16)`,
              fontSize: 13, fontWeight: 500, textDecoration: "none",
            }}
          >
            Gérer →
          </Link>
        </div>

        {/* Table header */}
        <div style={{
          padding: "14px 28px", background: BONE,
          borderBottom: `1px solid ${LINE}`,
          display: "grid", gridTemplateColumns: "64px 2fr 1fr 0.8fr 1fr 100px",
          gap: 16, fontFamily: "var(--lm-f-mono, monospace)", fontSize: 10.5,
          letterSpacing: "0.04em", color: MID, textTransform: "uppercase",
        }}>
          <span />
          <span>MATÉRIEL</span>
          <span>LOCALISATION</span>
          <span>PRIX / J</span>
          <span>STATUT</span>
          <span style={{ textAlign: "right" }}>ACTION</span>
        </div>

        {materiels.length === 0 ? (
          <div style={{ padding: "64px 28px", textAlign: "center" }}>
            <Package size={40} style={{ color: "rgba(10,10,9,0.1)", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 14, color: MID }}>Aucun matériel publié</p>
            <Link
              href="/dashboard/proprietaire/ajouter"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 12, padding: "10px 20px", borderRadius: 999,
                background: SIGNAL, color: "#FFFFFF",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}
            >
              <Plus size={14} /> Ajouter un matériel
            </Link>
          </div>
        ) : (
          <>
            {materiels.map((m, i) => {
              const img = getMaterielImage(m as Parameters<typeof getMaterielImage>[0]);
              const isDisponible = m.disponible !== false;
              return (
                <div key={m._id} style={{
                  padding: "18px 28px",
                  display: "grid",
                  gridTemplateColumns: "64px 2fr 1fr 0.8fr 1fr 100px",
                  gap: 16, alignItems: "center",
                  borderTop: i > 0 ? `1px solid ${LINE}` : "none",
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 12, overflow: "hidden",
                    background: "rgba(10,10,9,0.06)", flexShrink: 0,
                    position: "relative",
                  }}>
                    {img ? (
                      <Image src={img} alt={m.nom} fill style={{ objectFit: "cover" }} sizes="64px" />
                    ) : (
                      <div style={{ display: "grid", placeItems: "center", height: "100%", color: "rgba(10,10,9,0.2)" }}>
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{m.nom}</div>
                    <div className="lm-mono" style={{ fontSize: 11, color: MID, marginTop: 4 }}>
                      {m.nombreLocations !== undefined ? `${m.nombreLocations}× loué` : "—"}
                    </div>
                  </div>

                  <div style={{ fontSize: 13.5, color: CHAR }}>{m.localisation ?? "—"}</div>

                  <div className="lm-mega" style={{ fontSize: 20, color: INK }}>
                    {m.prixParJour ?? "—"}
                    <span style={{ fontSize: 10.5, color: MID, fontFamily: "var(--lm-f-mono, monospace)", fontWeight: 500, marginLeft: 3 }}>DH</span>
                  </div>

                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    height: 24, padding: "0 10px", borderRadius: 6,
                    fontFamily: "var(--lm-f-mono, monospace)", fontSize: 11,
                    letterSpacing: "0.02em", textTransform: "uppercase",
                    background: isDisponible ? OK_SOFT : WARN_SOFT,
                    color: isDisponible ? OK : WARN,
                    border: "1px solid transparent",
                    width: "fit-content",
                  }}>
                    {isDisponible ? "DISPONIBLE" : "LOUÉ"}
                  </span>

                  <Link
                    href={`/dashboard/proprietaire/materiels/${m._id}/edit`}
                    style={{
                      fontSize: 12.5, fontWeight: 700, color: SIGNAL,
                      textDecoration: "none", textAlign: "right",
                    }}
                  >
                    Modifier
                  </Link>
                </div>
              );
            })}
            <div style={{
              padding: "14px 28px", borderTop: `1px solid ${LINE}`,
              background: BONE,
            }}>
              <Link
                href="/dashboard/proprietaire/materiels"
                style={{ fontSize: 12, color: MID, fontFamily: "var(--lm-f-mono, monospace)", textDecoration: "none" }}
              >
                VOIR TOUS LES MATÉRIELS →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({ eyebrow, value, sub, subColor }: { eyebrow: string; value: string; sub: string; subColor: string }) {
  return (
    <div style={{
      background: "var(--lm-surface-card)", border: "1px solid var(--lm-line)",
      borderRadius: 28, padding: "28px 28px 24px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div className="lm-eyebrow">{eyebrow}</div>
      <div>
        <div className="lm-mega" style={{ fontSize: 52, color: "var(--lm-ink)" }}>{value}</div>
        <div style={{ marginTop: 8, fontSize: 12.5, color: subColor }}>{sub}</div>
      </div>
    </div>
  );
}
