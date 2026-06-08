"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  getLocataireStats,
  getMyLocations,
  getFeaturedMateriels,
  getStatutLabel,
  formatPrice,
  getMaterielImage,
  type Location,
  type Materiel,
} from "@/lib/api";
import {
  Plus,
  Download,
  ArrowRight,
  Lock,
  Package,
  MessageSquare,
  Wrench,
  Zap,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface Stats {
  locations: { enAttente: number; enCours: number; terminees: number; total: number };
  totalDepenses: number;
}

const PRODUCT_ICONS: LucideIcon[] = [Truck, Zap, Package, Wrench];

/* ──────────────────────────────────────────────────────────
   Studio-lit "product shot" — CSS-only campaign plate used in
   place of real photography. Replaces the flat AI-template look.
   ────────────────────────────────────────────────────────── */
type Tone = "studio" | "concrete" | "safety" | "onyx";

const TONES: Record<Tone, { top: string; mid: string; light: string; glow: string; silhouette: string }> = {
  studio:   { top: "#1A1A1B", mid: "#0E0E0F", light: "rgba(255,255,255,0.20)", glow: "rgba(255,77,0,0.25)", silhouette: "#FF4D00" },
  concrete: { top: "#3A3A38", mid: "#1F1F1E", light: "rgba(255,240,210,0.12)", glow: "rgba(255,170,80,0.16)", silhouette: "#FF8A3D" },
  safety:   { top: "#FFB347", mid: "#FF6A00", light: "rgba(255,255,200,0.45)", glow: "rgba(255,240,180,0.30)", silhouette: "#1A0E05" },
  onyx:     { top: "#202024", mid: "#0A0A0B", light: "rgba(180,200,255,0.10)", glow: "rgba(120,140,200,0.20)", silhouette: "#E8ECF2" },
};

function ProductShot({
  tone = "studio",
  Icon,
  className,
  iconSize = 96,
}: {
  tone?: Tone;
  Icon: LucideIcon;
  className?: string;
  iconSize?: number;
}) {
  const t = TONES[tone];
  return (
    <div
      className={`relative isolate overflow-hidden ${className ?? ""}`}
      style={{
        background: `
          radial-gradient(ellipse 70% 55% at 50% 18%, ${t.light}, transparent 65%),
          radial-gradient(ellipse 90% 70% at 50% 110%, ${t.glow}, transparent 70%),
          linear-gradient(180deg, ${t.top} 0%, ${t.mid} 100%)
        `,
      }}
    >
      <div className="lm-grain" />
      <div className="absolute inset-0 grid place-items-center">
        <Icon
          size={iconSize}
          strokeWidth={0.8}
          style={{
            color: t.silhouette,
            transform: "rotate(-6deg)",
            opacity: 0.96,
            filter: `drop-shadow(0 18px 26px rgba(0,0,0,0.45)) drop-shadow(0 0 30px ${t.glow})`,
          }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Status pill — quiet tinted tag, mono uppercase.
   ────────────────────────────────────────────────────────── */
function StatusTag({ statut }: { statut: Location["statut"] }) {
  const map: Record<Location["statut"], { bg: string; fg: string }> = {
    en_attente: { bg: "var(--lm-warn-soft)", fg: "var(--lm-warn)" },
    acceptee:   { bg: "var(--lm-ok-soft)", fg: "var(--lm-ok)" },
    en_cours:   { bg: "var(--lm-ok-soft)", fg: "var(--lm-ok)" },
    terminee:   { bg: "var(--lm-bone)", fg: "var(--lm-char)" },
    en_retard:  { bg: "var(--lm-signal)", fg: "var(--lm-paper)" },
    en_litige:  { bg: "#F6D6D2", fg: "#B0241A" },
    refusee:    { bg: "#F6D6D2", fg: "#B0241A" },
    annulee:    { bg: "var(--lm-bone)", fg: "var(--lm-mid)" },
  };
  const c = map[statut];
  return (
    <span
      className="lm-mono inline-flex items-center rounded-[6px] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.04em]"
      style={{ background: c.bg, color: c.fg }}
    >
      {getStatutLabel(statut)}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Locations table row
   ────────────────────────────────────────────────────────── */
function LocationRow({ loc, index }: { loc: Location; index: number }) {
  const img = getMaterielImage(loc.materielId as unknown as Materiel);
  const start = new Date(loc.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const end = new Date(loc.dateFinPrevue).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const Icon = PRODUCT_ICONS[index % PRODUCT_ICONS.length];
  const tone: Tone = (["studio", "safety", "concrete", "onyx"] as Tone[])[index % 4];
  const ref = `LOC-${loc._id.slice(-5).toUpperCase()}`;

  return (
    <div
      className="grid items-center gap-5 px-7 py-5"
      style={{
        gridTemplateColumns: "64px 1.6fr 1.1fr 1fr auto",
        borderTop: index === 0 ? "none" : "1px solid var(--lm-line)",
      }}
    >
      {/* Thumb */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px]">
        {img ? (
          <Image src={img} alt={loc.materielId.nom} fill className="object-cover" sizes="64px" />
        ) : (
          <ProductShot tone={tone} Icon={Icon} className="h-16 w-16" iconSize={40} />
        )}
      </div>

      {/* Name + ref */}
      <div className="min-w-0">
        <p
          className="truncate text-[15px] font-bold"
          style={{ color: "var(--lm-ink)", letterSpacing: "-0.012em" }}
        >
          {loc.materielId.nom}
        </p>
        <p className="lm-mono mt-1 text-[11px]" style={{ color: "var(--lm-mid)" }}>
          {ref}
        </p>
      </div>

      {/* Period */}
      <div>
        <p className="text-[13.5px] font-semibold" style={{ color: "var(--lm-ink)" }}>
          {start} → {end}
        </p>
        <p className="lm-mono mt-1 text-[11px]" style={{ color: "var(--lm-mid)" }}>
          {loc.nbJours} JOUR{loc.nbJours > 1 ? "S" : ""}
        </p>
      </div>

      {/* Status + amount */}
      <div className="flex flex-col items-start gap-2">
        <StatusTag statut={loc.statut} />
        <p className="lm-mono text-[11.5px]" style={{ color: "var(--lm-mid)" }}>
          {formatPrice(loc.montantLocation)}
        </p>
      </div>

      {/* Action */}
      <Link
        href={`/dashboard/locataire/locations/${loc._id}`}
        className="inline-flex items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-medium transition-colors"
        style={{
          height: 36,
          borderColor: "var(--lm-line-strong)",
          color: "var(--lm-ink)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--lm-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        Détails <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Link>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Recommendation tile
   ────────────────────────────────────────────────────────── */
function RecoTile({ item, index }: { item: Materiel; index: number }) {
  const img = getMaterielImage(item);
  const Icon = PRODUCT_ICONS[index % PRODUCT_ICONS.length];
  const tone: Tone = (["studio", "safety", "concrete", "onyx"] as Tone[])[index % 4];
  const distance = item.localisation ? item.localisation.split(",")[0] : "Maroc";

  return (
    <Link
      href={`/materiel/${item._id}`}
      className="group overflow-hidden rounded-2xl transition-transform"
      style={{
        background: "var(--lm-paper)",
        border: "1px solid var(--lm-line)",
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {img ? (
          <Image src={img} alt={item.nom} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="320px" />
        ) : (
          <ProductShot tone={tone} Icon={Icon} className="h-full w-full" iconSize={120} />
        )}
        <span
          className="lm-mono absolute right-3 top-3 inline-flex items-center rounded-[6px] px-2 py-1 text-[10px] uppercase tracking-[0.05em]"
          style={{ background: "rgba(255,255,255,0.92)", color: "var(--lm-ink)" }}
        >
          {item.disponible === false ? "Réservé" : "Dispo"}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p
            className="truncate text-[14px] font-bold"
            style={{ color: "var(--lm-ink)", letterSpacing: "-0.012em" }}
          >
            {item.nom}
          </p>
          <p className="lm-mono mt-1 truncate text-[11px]" style={{ color: "var(--lm-mid)" }}>
            {distance}
          </p>
        </div>
        <div className="lm-mega shrink-0 text-[24px]" style={{ color: "var(--lm-ink)" }}>
          {item.prixParJour}
          <span className="lm-mono ml-1 text-[11px] font-medium" style={{ color: "var(--lm-mid)" }}>
            DH
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────── */
export default function LocataireDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Location[]>([]);
  const [recommended, setRecommended] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, locsData, recsData] = await Promise.all([
          getLocataireStats(),
          getMyLocations({ limit: 4 }),
          getFeaturedMateriels(3),
        ]);
        setStats(statsData);
        setRecent(locsData.data);
        setRecommended(recsData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const firstName = user?.nom?.split(" ")[0] ?? "";
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();

  const nextDue = recent.find((l) => l.statut === "en_cours" || l.statut === "acceptee");
  const nextDueDate = nextDue ? new Date(nextDue.dateFinPrevue) : null;

  const pendingCount = stats?.locations.enAttente ?? 0;
  const greetingHook =
    pendingCount > 0
      ? `${pendingCount} action${pendingCount > 1 ? "s vous attendent" : " vous attend"}.`
      : "Tout est en ordre.";

  // ── Loading skeleton ───────────────────────────────────────
  if (loading) {
    return (
      <div className="p-10 lg:p-12">
        <div className="h-7 w-48 animate-pulse rounded" style={{ background: "var(--lm-bone-2)" }} />
        <div className="mt-4 h-20 w-2/3 animate-pulse rounded" style={{ background: "var(--lm-bone-2)" }} />
        <div
          className="mt-10 grid grid-cols-4 overflow-hidden rounded-3xl"
          style={{ border: "1px solid var(--lm-line)" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse"
              style={{
                background: "var(--lm-bone)",
                borderRight: i < 3 ? "1px solid var(--lm-line)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "En attente",
      value: stats?.locations.enAttente ?? 0,
      sub: pendingCount > 0 ? "Action requise" : "Rien à valider",
      signal: pendingCount > 0,
    },
    {
      label: "En cours",
      value: stats?.locations.enCours ?? 0,
      sub: (stats?.locations.enCours ?? 0) > 0 ? "Locations actives" : "Aucune en cours",
      signal: false,
      tone: "ok" as const,
    },
    {
      label: "Terminées",
      value: stats?.locations.terminees ?? 0,
      sub: "Historique complet",
      signal: false,
    },
    {
      label: "Dépensé",
      value: formatPrice(stats?.totalDepenses ?? 0).replace(/\s?DH$/, ""),
      sub: `${stats?.locations.total ?? 0} location${(stats?.locations.total ?? 0) > 1 ? "s" : ""} · MAD`,
      signal: false,
      isAmount: true,
    },
  ];

  return (
    <div className="px-6 py-10 lg:px-12 lg:py-12" style={{ background: "var(--lm-paper)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="lm-eyebrow mb-3.5">{today}</p>
          <h1
            className="lm-display"
            style={{
              fontSize: "clamp(40px, 5.4vw, 64px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: "var(--lm-ink)",
            }}
          >
            Bonjour, {firstName}.
            <br />
            <span style={{ color: "var(--lm-signal)" }}>{greetingHook}</span>
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="hidden items-center gap-2 rounded-full border bg-transparent px-4 text-[13px] font-medium transition-colors sm:inline-flex"
            style={{
              height: 40,
              borderColor: "var(--lm-line-strong)",
              color: "var(--lm-ink)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lm-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} /> Export
          </button>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-full px-5 text-[13px] font-medium transition-colors"
            style={{
              height: 40,
              background: "var(--lm-signal)",
              color: "var(--lm-paper)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lm-signal-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--lm-signal)";
            }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Nouvelle location
          </Link>
        </div>
      </header>

      {/* ── KPI strip ──────────────────────────────────────── */}
      <div
        className="mt-10 grid grid-cols-2 overflow-hidden rounded-[28px] lg:grid-cols-4"
        style={{
          border: "1px solid var(--lm-line)",
          background: "var(--lm-paper)",
        }}
      >
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className="px-7 py-7"
            style={{
              borderRight:
                i % 2 === 0 ? "1px solid var(--lm-line)" : "none",
              borderTop: i >= 2 ? "1px solid var(--lm-line)" : "none",
            }}
          >
            <p className="lm-eyebrow">{k.label}</p>
            <p
              className="lm-mega mt-3"
              style={{
                fontSize: k.isAmount ? 52 : 68,
                color: k.signal ? "var(--lm-signal)" : "var(--lm-ink)",
              }}
            >
              {k.value}
              {k.isAmount && (
                <span
                  className="lm-mono ml-1.5 align-baseline text-[14px] font-medium"
                  style={{ color: "var(--lm-mid)" }}
                >
                  MAD
                </span>
              )}
            </p>
            <p
              className="mt-2.5 text-[12.5px]"
              style={{
                color: k.signal
                  ? "var(--lm-signal)"
                  : k.tone === "ok"
                  ? "var(--lm-ok)"
                  : "var(--lm-mid)",
              }}
            >
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Locations en cours */}
        <section
          className="overflow-hidden rounded-[28px]"
          style={{ background: "var(--lm-paper)", border: "1px solid var(--lm-line)" }}
        >
          <header
            className="flex items-center justify-between px-7 py-6"
            style={{ borderBottom: "1px solid var(--lm-line)" }}
          >
            <div>
              <h2
                className="lm-display"
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--lm-ink)",
                }}
              >
                Mes dernières locations
              </h2>
              <p className="lm-mono mt-1.5 text-[11px]" style={{ color: "var(--lm-mid)" }}>
                {stats?.locations.total ?? 0} AU TOTAL · {stats?.locations.enCours ?? 0} ACTIVE
                {(stats?.locations.enCours ?? 0) > 1 ? "S" : ""}
              </p>
            </div>
            <Link
              href="/dashboard/locataire/locations"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium"
              style={{ color: "var(--lm-ink)" }}
            >
              Voir tout <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </header>

          {recent.length === 0 ? (
            <div className="px-7 py-16 text-center">
              <div
                className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl"
                style={{ background: "var(--lm-bone)", color: "var(--lm-muted)" }}
              >
                <Package className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="text-[14px]" style={{ color: "var(--lm-mid)" }}>
                Aucune location pour le moment.
              </p>
              <Link
                href="/catalogue"
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 text-[13px] font-medium"
                style={{ height: 40, background: "var(--lm-ink)", color: "var(--lm-paper)" }}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <div>
              {recent.map((loc, i) => (
                <LocationRow key={loc._id} loc={loc} index={i} />
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <footer
              className="flex items-center justify-between px-7 py-4"
              style={{
                background: "var(--lm-bone)",
                borderTop: "1px solid var(--lm-line)",
              }}
            >
              <p className="lm-mono text-[11px]" style={{ color: "var(--lm-mid)" }}>
                {recent.length} AFFICHÉE{recent.length > 1 ? "S" : ""} · {stats?.locations.total ?? 0} AU TOTAL
              </p>
              <Link
                href="/dashboard/locataire/locations"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold"
                style={{ color: "var(--lm-signal)" }}
              >
                Historique complet <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </footer>
          )}
        </section>

        {/* Right rail */}
        <aside className="flex flex-col gap-4">
          {/* Next return — dark dramatic tile */}
          <div
            className="relative overflow-hidden rounded-[28px] p-6"
            style={{ background: "var(--lm-ink)", color: "var(--lm-paper)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute h-[280px] w-[280px] rounded-full"
              style={{
                top: "-40%",
                right: "-20%",
                background: "radial-gradient(circle, var(--lm-signal) 0%, transparent 65%)",
                opacity: 0.35,
                filter: "blur(30px)",
              }}
            />
            <div className="relative">
              <p
                className="lm-eyebrow mb-3.5"
                style={{ color: "var(--lm-signal)" }}
              >
                Prochaine restitution
              </p>
              {nextDue && nextDueDate ? (
                <>
                  <p className="lm-mega" style={{ fontSize: 76, color: "var(--lm-paper)" }}>
                    {nextDueDate.getDate()}
                    <span
                      className="lm-mono ml-1.5 align-baseline text-[20px] font-medium"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {nextDueDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}
                    </span>
                  </p>
                  <p className="mt-3 text-[14.5px] font-semibold" style={{ color: "var(--lm-paper)" }}>
                    {nextDue.materielId.nom}
                  </p>
                  <p
                    className="lm-mono mt-1 text-[11px]"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {Math.max(0, Math.ceil((nextDueDate.getTime() - Date.now()) / 86400000))}{" "}
                    JOUR(S) RESTANT(S)
                  </p>
                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/dashboard/locataire/locations/${nextDue._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium transition-colors"
                      style={{ height: 36, background: "var(--lm-signal)", color: "var(--lm-paper)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--lm-signal-2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--lm-signal)";
                      }}
                    >
                      Voir les détails
                    </Link>
                    <Link
                      href="/dashboard/locataire/messages"
                      className="grid place-items-center rounded-full border transition-colors"
                      style={{
                        height: 36,
                        width: 36,
                        borderColor: "rgba(255,255,255,0.24)",
                        color: "var(--lm-paper)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                      aria-label="Message au propriétaire"
                    >
                      <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="lm-mega" style={{ fontSize: 72, color: "var(--lm-paper)" }}>
                    0
                  </p>
                  <p className="mt-3 text-[14.5px] font-semibold" style={{ color: "var(--lm-paper)" }}>
                    Aucune restitution
                  </p>
                  <p
                    className="lm-mono mt-1 text-[11px]"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Rien de prévu cette semaine
                  </p>
                  <Link
                    href="/catalogue"
                    className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full px-5 text-[12.5px] font-medium"
                    style={{ height: 36, background: "var(--lm-signal)", color: "var(--lm-paper)" }}
                  >
                    Explorer le catalogue <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Wallet / cautions */}
          <div
            className="rounded-[28px] p-6"
            style={{ background: "var(--lm-paper)", border: "1px solid var(--lm-line)" }}
          >
            <div className="mb-3.5 flex items-center justify-between">
              <p className="lm-eyebrow">Total dépensé</p>
              <Lock className="h-[15px] w-[15px]" style={{ color: "var(--lm-signal)" }} strokeWidth={1.75} />
            </div>
            <p className="lm-mega" style={{ fontSize: 50, color: "var(--lm-ink)" }}>
              {formatPrice(stats?.totalDepenses ?? 0).replace(/\s?DH$/, "")}
              <span
                className="lm-mono ml-1.5 align-baseline text-[14px] font-medium"
                style={{ color: "var(--lm-mid)" }}
              >
                MAD
              </span>
            </p>
            <p className="lm-mono mt-2 text-[11px]" style={{ color: "var(--lm-mid)" }}>
              {stats?.locations.total ?? 0} LOCATION{(stats?.locations.total ?? 0) > 1 ? "S" : ""} ·
              CUMUL
            </p>
            <div className="mt-5 flex h-[6px] gap-1 overflow-hidden rounded-full">
              <div className="flex-[3]" style={{ background: "var(--lm-signal)" }} />
              <div className="flex-[5]" style={{ background: "var(--lm-signal-soft)" }} />
              <div className="flex-[2]" style={{ background: "var(--lm-bone-2)" }} />
            </div>
          </div>

          {/* Activity feed */}
          <div
            className="rounded-[28px] p-6"
            style={{ background: "var(--lm-paper)", border: "1px solid var(--lm-line)" }}
          >
            <p className="lm-eyebrow mb-5">Activité</p>
            <div className="flex flex-col gap-4">
              {recent.slice(0, 3).map((r) => {
                const when = new Date(r.createdAt);
                const minutesAgo = Math.floor((Date.now() - when.getTime()) / 60000);
                const label =
                  minutesAgo < 60
                    ? `${minutesAgo}min`
                    : minutesAgo < 1440
                    ? `${Math.floor(minutesAgo / 60)}h`
                    : `${Math.floor(minutesAgo / 1440)}j`;
                const dot =
                  r.statut === "en_cours" || r.statut === "acceptee"
                    ? "var(--lm-ok)"
                    : r.statut === "en_attente"
                    ? "var(--lm-signal)"
                    : "var(--lm-muted)";
                return (
                  <div key={r._id} className="flex items-start gap-3">
                    <span
                      className="mt-[7px] block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: dot }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-[13.5px] font-semibold"
                        style={{ color: "var(--lm-ink)" }}
                      >
                        {r.materielId.nom}
                      </p>
                      <p
                        className="truncate text-[12px]"
                        style={{ color: "var(--lm-mid)" }}
                      >
                        {getStatutLabel(r.statut)} · {formatPrice(r.montantLocation)}
                      </p>
                    </div>
                    <span
                      className="lm-mono shrink-0 text-[11px]"
                      style={{ color: "var(--lm-mid)" }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
              {recent.length === 0 && (
                <p className="text-[13px]" style={{ color: "var(--lm-mid)" }}>
                  Pas encore d&apos;activité.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Recommendations ────────────────────────────────── */}
      <section className="mt-10">
        <header className="mb-6 flex items-end justify-between gap-6">
          <div>
            <h2
              className="lm-display"
              style={{
                fontSize: "clamp(26px, 3vw, 32px)",
                fontWeight: 900,
                letterSpacing: "-0.045em",
                color: "var(--lm-ink)",
              }}
            >
              Pour votre prochain chantier.
            </h2>
            <p className="mt-2 text-[14px]" style={{ color: "var(--lm-mid)" }}>
              Sélection d&apos;équipements recommandés près de vous.
            </p>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-[14px] font-bold"
            style={{ color: "var(--lm-signal)" }}
          >
            Catalogue <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((item, i) => (
            <RecoTile key={item._id} item={item} index={i} />
          ))}
          <Link
            href="/catalogue"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-colors"
            style={{
              border: "1px dashed var(--lm-line-strong)",
              color: "var(--lm-mid)",
              minHeight: 200,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lm-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-full"
              style={{ background: "var(--lm-ink)", color: "var(--lm-paper)" }}
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <p
              className="mt-1 text-[14px] font-bold"
              style={{ color: "var(--lm-ink)", letterSpacing: "-0.012em" }}
            >
              Explorer le catalogue
            </p>
            <p className="lm-mono text-[10.5px]" style={{ color: "var(--lm-mid)" }}>
              5 247 RÉFÉRENCES
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
