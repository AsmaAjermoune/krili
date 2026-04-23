"use client";

import { useEffect, useState, memo, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  getMyLocations,
  getStatutLabel,
  getStatutColor,
  formatPrice,
  getMaterielImage,
  cancelLocation,
  type Location,
} from "@/lib/api";
import { Package, ArrowLeft, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ALL_STATUSES = [
  { key: "", label: "Tous" },
  { key: "en_attente", label: "En attente" },
  { key: "acceptee", label: "Acceptée" },
  { key: "en_cours", label: "En cours" },
  { key: "terminee", label: "Terminée" },
  { key: "annulee", label: "Annulée" },
  { key: "refusee", label: "Refusée" },
];

const ITEM_ANIM = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35 },
  }),
};

const LocationCard = memo(function LocationCard({
  loc,
  index,
  onCancel,
}: {
  loc: Location;
  index: number;
  onCancel: (id: string) => void;
}) {
  const img = getMaterielImage(loc.materielId as unknown as import("@/lib/api").Materiel);
  const canCancel = loc.statut === "en_attente";

  return (
    <motion.div custom={index} variants={ITEM_ANIM} initial="hidden" animate="show">
      <div className="group flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100/80 hover:shadow-md transition-all duration-200 sm:flex-row sm:items-center">
        {/* Image */}
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-20">
          {img ? (
            <Image src={img} alt={loc.materielId.nom} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-8 w-8 text-slate-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-[#0f172a]">{loc.materielId.nom}</h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                getStatutColor(loc.statut)
              )}
            >
              {getStatutLabel(loc.statut)}
            </span>
          </div>
          {loc.materielId.localisation && (
            <p className="mt-0.5 text-xs text-slate-400">{loc.materielId.localisation}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>
              Du{" "}
              <strong className="text-[#0f172a]">
                {new Date(loc.dateDebut).toLocaleDateString("fr-MA", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </span>
            <span>
              Au{" "}
              <strong className="text-[#0f172a]">
                {new Date(loc.dateFinPrevue).toLocaleDateString("fr-MA", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </span>
            <span>
              {loc.nbJours} jour{loc.nbJours > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Price + actions */}
        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-lg font-black text-[#ff6700]">{formatPrice(loc.montantLocation)}</p>
          {canCancel && (
            <button
              onClick={() => onCancel(loc._id)}
              className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const [canceling, setCanceling] = useState<string | null>(null);

  useEffect(() => {
    getMyLocations({ limit: 100 })
      .then((r) => setLocations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCancel(id: string) {
    if (!confirm("Voulez-vous vraiment annuler cette location ?")) return;
    setCanceling(id);
    try {
      const updated = await cancelLocation(id);
      setLocations((prev) => prev.map((l) => (l._id === id ? updated : l)));
    } catch {
      alert("Erreur lors de l'annulation.");
    } finally {
      setCanceling(null);
    }
  }

  const filtered = useMemo(() => {
    let result = locations;
    if (activeTab) result = result.filter((l) => l.statut === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.materielId.nom.toLowerCase().includes(q));
    }
    return result;
  }, [locations, activeTab, search]);

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
        <h1 className="text-2xl font-black text-[#0f172a] lg:text-3xl">Mes locations</h1>
        <p className="mt-1 text-sm text-slate-400">{locations.length} location{locations.length !== 1 ? "s" : ""} au total</p>
      </motion.div>

      {/* Search + filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par matériel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-[#004e98] transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {ALL_STATUSES.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                activeTab === tab.key
                  ? "bg-[#0f172a] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm border border-slate-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
            <Package className="h-8 w-8 text-slate-200" />
          </div>
          <p className="font-medium text-slate-500">Aucune location trouvée</p>
          <Link href="/catalogue" className="mt-4 inline-block rounded-xl bg-[#ff6700] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e55f00] transition-colors">
            Louer du matériel
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((loc, i) => (
            <LocationCard
              key={loc._id}
              loc={loc}
              index={i}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
