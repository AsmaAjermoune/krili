"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  getMyLocations,
  getFeaturedMateriels,
  getStatutLabel,
  formatPrice,
  getMaterielImage,
  cancelLocation,
  returnMateriel,
  createLitige,
  type Location,
  type Materiel,
} from "@/lib/api";
import {
  Package,
  MapPin,
  Eye,
  RotateCcw,
  X,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tab config ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "en_attente", label: "En attente", icon: Clock,          color: "#f59e0b" },
  { key: "acceptee",   label: "Acceptées",  icon: CheckCircle2,   color: "#10b981" },
  { key: "en_cours",   label: "En cours",   icon: Package,        color: "#3b82f6" },
  { key: "terminee",   label: "Terminées",  icon: CheckCircle2,   color: "#22c55e" },
  { key: "en_retard",  label: "En retard",  icon: AlertCircle,    color: "#ef4444" },
  { key: "en_litige",  label: "En litige",  icon: AlertCircle,    color: "#d97706" },
  { key: "",           label: "Toutes",     icon: Package,        color: "#64748b" },
];

const STATUS_BADGE: Record<string, string> = {
  en_attente: "bg-amber-50 text-amber-700 border border-amber-200",
  acceptee:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  en_cours:   "bg-blue-50 text-blue-700 border border-blue-200",
  terminee:   "bg-slate-100 text-slate-500 border border-slate-200",
  en_retard:  "bg-red-50 text-red-700 border border-red-200",
  en_litige:  "bg-amber-50 text-amber-700 border border-amber-200",
  refusee:    "bg-red-50 text-red-600 border border-red-200",
  annulee:    "bg-slate-100 text-slate-400 border border-slate-200",
};

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const ITEM = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function daysRemaining(dateStr: string): { days: number; overdue: boolean } {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  return { days: Math.abs(days), overdue: days < 0 };
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(start)} → ${fmt(end)}`;
}

// ── Location Row ───────────────────────────────────────────────────────────────

function LocationRow({
  loc,
  index,
  onCancel,
  onReturn,
  onLitige,
  actionLoading,
}: {
  loc: Location;
  index: number;
  onCancel: (id: string) => void;
  onReturn: (id: string) => void;
  onLitige: (id: string) => void;
  actionLoading: string | null;
}) {
  const img = getMaterielImage(loc.materielId as unknown as Materiel);
  const ref = `LOC-${loc._id.slice(-5).toUpperCase()}`;
  const canCancel = loc.statut === "en_attente" || loc.statut === "acceptee";
  const canReturn = loc.statut === "en_cours" || loc.statut === "en_retard" || loc.statut === "acceptee";
  const canLitige = ["acceptee", "en_cours", "terminee", "en_retard"].includes(loc.statut);
  const { days, overdue } = daysRemaining(loc.dateFinPrevue);
  const isLoading = actionLoading === loc._id;

  return (
    <motion.div
      custom={index}
      variants={ITEM}
      initial="hidden"
      animate="show"
      className="group grid grid-cols-[56px_1fr_180px_120px_160px] items-center gap-4 border-b border-slate-50 px-6 py-4 last:border-0 hover:bg-slate-50/60 transition-colors"
    >
      {/* Image */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {img ? (
          <Image src={img} alt={loc.materielId.nom} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-6 w-6 text-slate-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#0f172a] dark:text-white">{loc.materielId.nom}</p>
        <p className="text-xs text-slate-400">Réf : {ref}</p>
        {loc.materielId.localisation && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {loc.materielId.localisation}
          </div>
        )}
      </div>

      {/* Période */}
      <div>
        <p className="text-sm text-[#0f172a] dark:text-white">{formatDateRange(loc.dateDebut, loc.dateFinPrevue)}</p>
        {(loc.statut === "en_cours" || loc.statut === "en_retard") && (
          <p
            className={cn(
              "mt-0.5 text-xs font-semibold",
              overdue ? "text-red-500" : days === 0 ? "text-amber-500" : "text-slate-400"
            )}
          >
            {overdue
              ? `${days} jour${days > 1 ? "s" : ""} de retard`
              : days === 0
              ? "Retour aujourd'hui"
              : `${days} jour${days > 1 ? "s" : ""} restant${days > 1 ? "s" : ""}`}
          </p>
        )}
      </div>

      {/* Statut + montant */}
      <div className="text-right">
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_BADGE[loc.statut])}>
          {getStatutLabel(loc.statut).toUpperCase()}
        </span>
        <p className="mt-1.5 text-sm font-bold text-[#ff6700]">{formatPrice(loc.montantLocation)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {canReturn && (
          <button
            onClick={() => onReturn(loc._id)}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all disabled:opacity-60 hover:shadow-md"
            style={{ background: "linear-gradient(135deg,#004e98,#0066cc)" }}
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Signaler le retour
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => onCancel(loc._id)}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" />
            Annuler
          </button>
        )}
        {canLitige && (
          <button
            onClick={() => onLitige(loc._id)}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 text-amber-500 transition-all hover:bg-amber-50 disabled:opacity-60"
            title="Ouvrir un litige"
          >
            <Flag className="h-4 w-4" />
          </button>
        )}
        <Link
          href={`/materiel/${loc.materielId._id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:text-[#0f172a]"
        >
          <Eye className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Recommendation Card ────────────────────────────────────────────────────────

function RecoCard({ item }: { item: Materiel }) {
  const img = getMaterielImage(item);
  return (
    <Link
      href={`/materiel/${item._id}`}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative h-40 bg-slate-100 dark:bg-slate-700">
        {img ? (
          <Image src={img} alt={item.nom} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="220px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-slate-300" />
          </div>
        )}
        {item.disponible && (
          <span
            className="absolute right-2 top-2 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
            style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff" }}
          >
            Disponible
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-[#0f172a] dark:text-white line-clamp-1">{item.nom}</h4>
        {item.localisation && (
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {item.localisation}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#ff6700]">{formatPrice(item.prixParJour)}</span>
            <span className="text-xs text-slate-400">/j</span>
          </div>
          <span className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-bold text-[#ff6700]">Louer →</span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [recommended, setRecommended] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("en_cours");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [litigeModal, setLitigeModal] = useState<{ id: string } | null>(null);
  const [litigeDesc, setLitigeDesc] = useState("");
  const [litigeLoading, setLitigeLoading] = useState(false);
  const [litigeError, setLitigeError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMyLocations({ limit: 200 }), getFeaturedMateriels(3)])
      .then(([locsRes, recs]) => {
        setLocations(locsRes.data);
        setRecommended(recs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      en_attente: locations.filter((l) => l.statut === "en_attente").length,
      acceptee:   locations.filter((l) => l.statut === "acceptee").length,
      en_cours:   locations.filter((l) => l.statut === "en_cours").length,
      terminee:   locations.filter((l) => l.statut === "terminee").length,
      en_retard:  locations.filter((l) => l.statut === "en_retard").length,
      en_litige:  locations.filter((l) => l.statut === "en_litige").length,
      "":         locations.length,
    }),
    [locations]
  );

  const displayed = useMemo(
    () => (activeTab ? locations.filter((l) => l.statut === activeTab) : locations),
    [locations, activeTab]
  );

  async function handleCancel(id: string) {
    if (!confirm("Voulez-vous vraiment annuler cette location ?")) return;
    setActionLoading(id);
    try {
      const updated = await cancelLocation(id);
      setLocations((prev) => prev.map((l) => (l._id === id ? updated : l)));
    } catch {
      alert("Impossible d'annuler cette location.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReturn(id: string) {
    if (!confirm("Confirmez-vous le retour du matériel ?")) return;
    setActionLoading(id);
    try {
      const updated = await returnMateriel(id);
      setLocations((prev) => prev.map((l) => (l._id === id ? updated : l)));
    } catch {
      alert("Impossible de signaler le retour.");
    } finally {
      setActionLoading(null);
    }
  }

  function handleOpenLitige(id: string) {
    setLitigeModal({ id });
    setLitigeDesc("");
    setLitigeError(null);
  }

  async function handleSubmitLitige() {
    if (!litigeModal) return;
    if (litigeDesc.trim().length < 10) {
      setLitigeError("Description trop courte (10 caractères min)");
      return;
    }
    setLitigeLoading(true);
    setLitigeError(null);
    try {
      await createLitige(litigeModal.id, litigeDesc.trim());
      setLitigeModal(null);
      setLitigeDesc("");
    } catch (err) {
      setLitigeError(err instanceof Error ? err.message : "Erreur lors de l'ouverture du litige");
    } finally {
      setLitigeLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-[#0f172a] dark:text-white lg:text-3xl">
            MES LOCATIONS
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Suivez l&apos;état de vos locations d&apos;équipements en cours et passées.
          </p>
        </div>
        <Link
          href="/catalogue"
          className="hidden items-center gap-2 rounded-[24px] bg-[#004e98] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#003d7a] transition-all sm:flex"
        >
          <ShoppingBag className="h-4 w-4" />
          Nouvelle location
        </Link>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex border-b border-[#e2e8f0] w-fit gap-0">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const count = counts[tab.key as keyof typeof counts] ?? 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-150",
                  active
                    ? "border-[#ff6700] text-[#ff6700]"
                    : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-black",
                      active ? "bg-[#ff6700]/10 text-[#ff6700]" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[24px] bg-white dark:bg-slate-800 shadow-sm border border-[#f1f5f9] dark:border-slate-700">
        {/* Column headers */}
        <div className="grid grid-cols-[56px_1fr_180px_120px_160px] gap-4 border-b border-[#f1f5f9] dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-700/60 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
          <span />
          <span>Matériel</span>
          <span>Période de location</span>
          <span className="text-right">Statut</span>
          <span className="text-right">Action</span>
        </div>

        {loading ? (
          <div className="space-y-px">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="h-8 w-36 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Package className="h-8 w-8 text-slate-200" />
            </div>
            <p className="font-semibold text-slate-500">Aucune location dans cette catégorie</p>
            <Link
              href="/catalogue"
              className="mt-4 inline-block rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-md"
              style={{ background: "linear-gradient(135deg,#ff6700,#ff8c38)" }}
            >
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            {displayed.map((loc, i) => (
              <LocationRow
                key={loc._id}
                loc={loc}
                index={i}
                onCancel={handleCancel}
                onReturn={handleReturn}
                onLitige={handleOpenLitige}
                actionLoading={actionLoading}
              />
            ))}
          </motion.div>
        )}

        {/* Footer link */}
        {!loading && displayed.length > 0 && (
          <div className="border-t border-[#f1f5f9] px-6 py-3 text-center">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#004e98] hover:underline"
            >
              Voir l&apos;historique complet
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#0f172a] dark:text-white">Complétez votre équipement</h2>
              <p className="text-sm text-slate-400">Explorer nos 2500+ références</p>
            </div>
            <Link
              href="/catalogue"
              className="text-sm font-semibold text-[#ff6700] hover:underline"
            >
              Voir le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((item) => (
              <RecoCard key={item._id} item={item} />
            ))}
            {/* "Need more" card */}
            <Link
              href="/catalogue"
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-center transition-all hover:border-[#ff6700]/30 hover:bg-orange-50/30 dark:hover:bg-slate-700/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <ShoppingBag className="h-6 w-6 text-slate-400" />
              </div>
              <p className="mt-3 font-semibold text-slate-500">Besoin d&apos;autre chose ?</p>
              <p className="mt-1 text-xs text-slate-400">Explorer nos 2500+ références</p>
            </Link>
          </div>
        </div>
      )}

      {/* Litige modal */}
      {litigeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--lm-surface-card)" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                <Flag className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-black" style={{ color: "var(--lm-ink)" }}>Ouvrir un litige</h3>
                <p className="text-xs" style={{ color: "var(--lm-mid)" }}>Décrivez le problème rencontré</p>
              </div>
            </div>

            <textarea
              value={litigeDesc}
              onChange={(e) => setLitigeDesc(e.target.value)}
              rows={4}
              placeholder="Ex : Le matériel ne correspond pas à la description, il manque des accessoires..."
              className="w-full resize-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
              style={{ border: "1px solid var(--lm-line)", background: "var(--lm-bone)", color: "var(--lm-ink)" }}
            />

            {litigeError && (
              <p className="mt-2 text-xs font-medium text-red-500">{litigeError}</p>
            )}

            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => setLitigeModal(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                style={{ border: "1px solid var(--lm-line)", color: "var(--lm-mid)", background: "var(--lm-bone)" }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitLitige}
                disabled={litigeLoading || litigeDesc.trim().length < 10}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
              >
                {litigeLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Flag className="h-4 w-4" />
                )}
                Ouvrir le litige
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
