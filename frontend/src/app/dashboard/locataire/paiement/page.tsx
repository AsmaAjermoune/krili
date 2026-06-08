"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  RefreshCw,
  Receipt,
  Download,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { getMyLocations, formatPrice, type Location } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────

type PayRow = {
  id: string;
  date: string;
  materielNom: string;
  materielRef: string;
  montant: number;
  caution: number;
  statut: string;
  type: "location" | "caution";
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function toRows(locs: Location[]): PayRow[] {
  return locs
    .filter((l) => l.statut !== "annulee" && l.statut !== "refusee")
    .map((l) => ({
      id: l._id,
      date: l.createdAt ?? "",
      materielNom: (l.materielId as unknown as { nom?: string })?.nom ?? "Matériel",
      materielRef: `LOC-${l._id.slice(-5).toUpperCase()}`,
      montant: l.montantLocation,
      caution: l.cautionMontant,
      statut: l.statut,
      type: "location" as const,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  acceptee:   { label: "Validé",     cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  en_cours:   { label: "En cours",   cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  terminee:   { label: "Terminé",    cls: "bg-slate-100 text-slate-600 border border-slate-200" },
  en_retard:  { label: "En retard",  cls: "bg-red-50 text-red-700 border border-red-200" },
  en_litige:  { label: "En litige",  cls: "bg-red-50 text-red-700 border border-red-200" },
  remboursee: { label: "Remboursé",  cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
};

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const ITEM = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const PAGE_SIZE = 8;

// ── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  sub,
  value,
  valueClass,
  bg,
  iconColor,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  value: string;
  valueClass: string;
  bg: string;
  iconColor: string;
  trend?: string;
}) {
  return (
    <motion.div
      variants={ITEM}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-slate-100 dark:border-slate-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className={`mt-1 text-2xl font-black ${valueClass}`}>{value}</p>
        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PaiementsPage() {
  const [locs, setLocs] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyLocations({ limit: 200 })
      .then((d) => setLocs(d.data ?? []))
      .catch(() => setLocs([]))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => toRows(locs), [locs]);

  const totalPaye = useMemo(
    () => rows.filter((r) => ["terminee", "en_cours", "acceptee"].includes(r.statut)).reduce((s, r) => s + r.montant, 0),
    [rows]
  );
  const cautionsBloquees = useMemo(
    () => rows.filter((r) => ["en_cours", "en_retard"].includes(r.statut)).reduce((s, r) => s + r.caution, 0),
    [rows]
  );
  const remboursements = 0;

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="space-y-4 px-5 py-6 lg:px-8 lg:py-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] dark:text-white lg:text-3xl">Mes Paiements</h1>
          <p className="mt-1 text-sm text-[#64748b] dark:text-slate-400">
            Consultez l&apos;historique de vos transactions et vos cautions en cours.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="hidden items-center gap-2 rounded-[24px] border border-[#e2e8f0] dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-[#0f172a] dark:text-white shadow-sm hover:shadow-md transition-all sm:flex"
        >
          <Download className="h-4 w-4" />
          Exporter
        </button>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          icon={CreditCard}
          label="Total payé"
          sub="Cumul de toutes vos locations"
          value={formatPrice(totalPaye)}
          valueClass="text-[#0f172a]"
          bg="rgba(0,78,152,0.08)"
          iconColor="#004e98"
          trend="+12% ce mois"
        />
        <StatCard
          icon={Lock}
          label="Cautions bloquées"
          sub="En attente de restitution"
          value={formatPrice(cautionsBloquees)}
          valueClass="text-amber-600"
          bg="#fef9c3"
          iconColor="#d97706"
        />
        <StatCard
          icon={RefreshCw}
          label="Remboursements"
          sub="Cumul année en cours"
          value={formatPrice(remboursements)}
          valueClass="text-emerald-600"
          bg="#f0fdf4"
          iconColor="#16a34a"
        />
      </motion.div>

      {/* Transaction table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        {/* Table header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700">
              <Receipt className="h-4 w-4 text-slate-500 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="font-bold text-[#0f172a] dark:text-white">Historique des transactions</h2>
              <p className="text-xs text-slate-400">{rows.length} transaction{rows.length !== 1 ? "s" : ""} au total</p>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <CreditCard className="h-8 w-8 text-slate-200" />
            </div>
            <p className="font-semibold text-slate-500">Aucune transaction pour l&apos;instant</p>
            <p className="mt-1 text-sm text-slate-400">Vos paiements apparaîtront ici après votre première location.</p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_140px_120px_110px_100px] gap-4 border-b border-slate-50 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/60 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              <span>Matériel</span>
              <span>Date</span>
              <span className="text-right">Montant</span>
              <span className="text-right">Caution</span>
              <span className="text-center">Statut</span>
            </div>

            <motion.div variants={STAGGER} initial="hidden" animate="show">
              {paginated.map((row) => {
                const cfg = STATUS_CONFIG[row.statut] ?? { label: row.statut, cls: "bg-slate-100 text-slate-600" };
                return (
                  <motion.div
                    key={row.id}
                    variants={ITEM}
                    className="grid grid-cols-[1fr_140px_120px_110px_100px] gap-4 items-center border-b border-slate-50 dark:border-slate-700 px-6 py-4 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    {/* Matériel */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                        <Receipt className="h-4 w-4 text-slate-400 dark:text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0f172a] dark:text-white">{row.materielNom}</p>
                        <p className="text-xs text-slate-400">{row.materielRef}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {row.date
                        ? new Date(row.date).toLocaleDateString("fr-MA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </div>

                    {/* Montant */}
                    <p className="text-right text-sm font-bold text-[#0f172a] dark:text-white">{formatPrice(row.montant)}</p>

                    {/* Caution */}
                    <p className="text-right text-sm font-medium text-slate-500">{formatPrice(row.caution)}</p>

                    {/* Statut */}
                    <div className="flex justify-center">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 px-6 py-4">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Affichage de{" "}
                  <strong className="text-[#0f172a] dark:text-white">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, rows.length)}</strong>{" "}
                  sur <strong className="text-[#0f172a] dark:text-white">{rows.length}</strong> transactions
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 transition-all hover:border-slate-300 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-all"
                      style={
                        page === p
                          ? { background: "linear-gradient(135deg,#004e98,#0066cc)", color: "#fff" }
                          : { border: "1px solid var(--lm-line)", color: "var(--lm-ink)", background: "var(--lm-surface-card)" }
                      }
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 transition-all hover:border-slate-300 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
