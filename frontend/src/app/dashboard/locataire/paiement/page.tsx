"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  getMyLocations,
  formatPrice,
  getMaterielImage,
  getStatutLabel,
  getStatutColor,
  type Location,
  type Materiel,
} from "@/lib/api";
import { Wallet, Package, ArrowLeft, TrendingUp, Shield, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function useCountUp(target: number) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let frame = 0;
    const FRAMES = 50;
    const tick = () => {
      frame++;
      const t = Math.min(frame / FRAMES, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return val;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  isAmount = true,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
  isAmount?: boolean;
}) {
  const animated = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100/80"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <div className="rounded-xl p-2" style={{ background: bg }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-black tracking-tight" style={{ color }}>
        {isAmount
          ? `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(animated)} MAD`
          : String(animated)}
      </p>
    </motion.div>
  );
}

export default function LocatairePaiementPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLocations({ limit: 100 })
      .then((r) => setLocations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const paid = useMemo(
    () => locations.filter((l) => ["en_cours", "terminee"].includes(l.statut)),
    [locations]
  );
  const totalPaid = useMemo(
    () => paid.reduce((sum, l) => sum + (l.montantLocation || 0), 0),
    [paid]
  );
  const cautionEnCours = useMemo(
    () =>
      locations
        .filter((l) => l.statut === "en_cours")
        .reduce((sum, l) => sum + ((l.materielId as any)?.caution || 0), 0),
    [locations]
  );
  const remboursements = 0;

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          href="/dashboard/locataire"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0f172a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Tableau de bord
        </Link>
        <h1 className="text-2xl font-black text-[#0f172a] lg:text-3xl">Paiements</h1>
        <p className="mt-1 text-sm text-slate-400">Historique et résumé de vos transactions</p>
      </motion.div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Wallet}
            label="Total payé"
            value={totalPaid}
            color="#ff6700"
            bg="rgba(255,103,0,0.08)"
          />
          <SummaryCard
            icon={Shield}
            label="Caution en cours"
            value={cautionEnCours}
            color="#004e98"
            bg="rgba(0,78,152,0.08)"
          />
          <SummaryCard
            icon={RefreshCw}
            label="Remboursements"
            value={remboursements}
            color="#22c55e"
            bg="#f0fdf4"
          />
        </div>
      )}

      {/* Transactions table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100/80"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-bold text-[#0f172a]">Historique des paiements</h2>
            <p className="text-xs text-slate-400">{locations.length} transaction{locations.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : locations.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Package className="h-8 w-8 text-slate-200" />
            </div>
            <p className="font-medium text-slate-500">Aucun paiement pour le moment</p>
            <Link
              href="/catalogue"
              className="mt-4 inline-block rounded-xl bg-[#ff6700] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e55f00] transition-colors"
            >
              Louer du matériel
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">Matériel</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">Période</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">Montant</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">Caution</th>
                    <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {locations.map((loc) => {
                    const img = getMaterielImage(loc.materielId as unknown as Materiel);
                    const caution = (loc.materielId as any)?.caution || 0;
                    return (
                      <tr key={loc._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {img ? (
                                <Image src={img} alt={loc.materielId.nom} fill className="object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Package className="h-5 w-5 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <span className="font-semibold text-[#0f172a] line-clamp-1">{loc.materielId.nom}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(loc.dateDebut).toLocaleDateString("fr-MA", { day: "numeric", month: "short" })}
                          {" → "}
                          {new Date(loc.dateFinPrevue).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-[#ff6700]">{formatPrice(loc.montantLocation)}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {caution > 0 ? formatPrice(caution) : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", getStatutColor(loc.statut))}>
                            {getStatutLabel(loc.statut)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {locations.map((loc) => {
                const img = getMaterielImage(loc.materielId as unknown as Materiel);
                const caution = (loc.materielId as any)?.caution || 0;
                return (
                  <div key={loc._id} className="flex items-center gap-4 px-5 py-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {img ? (
                        <Image src={img} alt={loc.materielId.nom} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0f172a]">{loc.materielId.nom}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Date(loc.dateDebut).toLocaleDateString("fr-MA", { day: "numeric", month: "short" })}
                        {" → "}
                        {new Date(loc.dateFinPrevue).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-[#ff6700]">{formatPrice(loc.montantLocation)}</p>
                      <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold", getStatutColor(loc.statut))}>
                        {getStatutLabel(loc.statut)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
