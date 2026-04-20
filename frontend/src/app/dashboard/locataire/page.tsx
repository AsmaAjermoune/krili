"use client";

import { useEffect, useState, Suspense, lazy, memo, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  getLocataireStats,
  getMyLocations,
  getNotifications,
  getStatutLabel,
  getStatutColor,
  formatPrice,
  getMaterielImage,
  type Location,
  type Materiel,
} from "@/lib/api";
import {
  Clock,
  Package,
  CheckCircle,
  Wallet,
  ArrowRight,
  Bell,
  TrendingUp,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SpendingChart = lazy(() => import("@/components/dashboard/SpendingChart"));
const StatusDonutChart = lazy(() => import("@/components/dashboard/StatusDonutChart"));

interface Stats {
  locations: { enAttente: number; enCours: number; terminees: number; total: number };
  totalDepenses: number;
}

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const CARD_ANIM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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

const StatCard = memo(function StatCard({
  label,
  value,
  total,
  icon: Icon,
  color,
  bg,
  isAmount,
  tooltip,
}: {
  label: string;
  value: number;
  total?: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  isAmount?: boolean;
  tooltip?: string;
}) {
  const animated = useCountUp(value);
  const display = isAmount
    ? `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(animated)} MAD`
    : String(animated);
  const pct = total && total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <motion.div variants={CARD_ANIM}>
      <Tooltip>
        <TooltipTrigger
          render={<div className="group cursor-default rounded-2xl bg-white p-5 shadow-sm border border-slate-100/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" />}
        >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <div className="rounded-xl p-2" style={{ background: bg }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            </div>
            <p
              className="text-2xl font-black tracking-tight"
              style={{ color: isAmount ? "#ff6700" : "#0f172a" }}
            >
              {display}
            </p>
            {isAmount ? (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                Total cumulé
              </p>
            ) : (
              total !== undefined && (
                <div className="mt-3">
                  <Progress value={pct} className="gap-1">
                    <ProgressTrack className="h-1.5 bg-slate-100">
                      <ProgressIndicator
                        className="transition-all duration-700"
                        style={{ backgroundColor: color, width: `${pct}%` }}
                      />
                    </ProgressTrack>
                  </Progress>
                  <p className="mt-1 text-[10px] text-slate-400">{pct}% du total</p>
                </div>
              )
            )}
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </motion.div>
  );
});

const LocationItem = memo(function LocationItem({ loc }: { loc: Location }) {
  const img = getMaterielImage(loc.materielId as unknown as Materiel);
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:bg-slate-50/50 transition-all">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
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
          {new Date(loc.dateFinPrevue).toLocaleDateString("fr-MA", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        {loc.materielId.localisation && (
          <p className="mt-0.5 truncate text-xs text-slate-400">{loc.materielId.localisation}</p>
        )}
      </div>
      <div className="shrink-0 space-y-2 text-right">
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold",
            getStatutColor(loc.statut)
          )}
        >
          {getStatutLabel(loc.statut)}
        </span>
        <p className="text-sm font-bold text-[#ff6700]">{formatPrice(loc.montantLocation)}</p>
      </div>
    </div>
  );
});

function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

const STATUS_TABS = [
  { key: "", label: "Récentes" },
  { key: "en_attente", label: "En attente" },
  { key: "acceptee", label: "Acceptée" },
  { key: "en_cours", label: "En cours" },
  { key: "terminee", label: "Terminée" },
];

export default function LocataireDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Location[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [statsData, allData] = await Promise.all([
          getLocataireStats(),
          getMyLocations({ limit: 50 }),
        ]);
        setStats(statsData);
        setRecent(allData.data.slice(0, 5));
        setAllLocations(allData.data);
        getNotifications().then((r) => setUnread(r.unreadCount)).catch(() => {});
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayed = useMemo(
    () => (activeTab ? allLocations.filter((l) => l.statut === activeTab) : recent),
    [activeTab, allLocations, recent]
  );

  if (loading) return <DashboardSkeleton />;

  const totalLocations = stats?.locations.total ?? 0;

  const statCards = stats
    ? [
        {
          label: "En attente",
          value: stats.locations.enAttente,
          total: totalLocations,
          icon: Clock,
          color: "#f59e0b",
          bg: "#fef9c3",
          tooltip: "Demandes en attente de confirmation",
        },
        {
          label: "En cours",
          value: stats.locations.enCours,
          total: totalLocations,
          icon: Package,
          color: "#3b82f6",
          bg: "#eff6ff",
          tooltip: "Locations actuellement actives",
        },
        {
          label: "Terminées",
          value: stats.locations.terminees,
          total: totalLocations,
          icon: CheckCircle,
          color: "#22c55e",
          bg: "#f0fdf4",
          tooltip: "Locations complétées avec succès",
        },
        {
          label: "Total dépensé",
          value: stats.totalDepenses,
          icon: Wallet,
          color: "#004e98",
          bg: "#eff6ff",
          isAmount: true,
          tooltip: "Montant total de toutes vos locations",
        },
      ]
    : [];

  return (
    <div className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0f172a] lg:text-3xl">
              {getGreeting()},{" "}
              <span className="text-[#ff6700]">{user?.nom?.split(" ")[0]}</span> !
            </h1>
            <Sparkles className="hidden h-5 w-5 text-yellow-400 lg:block" />
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {new Date().toLocaleDateString("fr-MA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/dashboard/locataire"
                  className="relative hidden rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm hover:border-slate-300 hover:text-[#0f172a] transition-colors lg:flex"
                />
              }
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6700] text-[9px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {unread > 0 ? `${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}` : "Notifications"}
            </TooltipContent>
          </Tooltip>
          <Link href="/catalogue">
            <Button className="rounded-xl bg-[#ff6700] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#ff6700]/25 hover:bg-[#e55f00] transition-all">
              <Plus className="mr-1.5 h-4 w-4" />
              Nouvelle location
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100/80 lg:col-span-3"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#0f172a]">Évolution des dépenses</h2>
              <p className="text-xs text-slate-400">6 derniers mois</p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#ff6700]">
              MAD
            </span>
          </div>
          <div className="h-48">
            <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
              <SpendingChart locations={allLocations} />
            </Suspense>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100/80 lg:col-span-2"
        >
          <div className="mb-2">
            <h2 className="font-bold text-[#0f172a]">Statut des locations</h2>
            <p className="text-xs text-slate-400">Répartition globale</p>
          </div>
          <div className="h-56">
            <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
              {stats && (
                <StatusDonutChart
                  enAttente={stats.locations.enAttente}
                  enCours={stats.locations.enCours}
                  terminees={stats.locations.terminees}
                />
              )}
            </Suspense>
          </div>
        </motion.div>
      </div>

      {/* Recent locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100/80"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#0f172a]">Mes locations</h2>
            <p className="text-xs text-slate-400">{stats?.locations.total ?? 0} au total</p>
          </div>
          <Link
            href="/dashboard/locataire/locations"
            className="flex items-center gap-1 text-xs font-semibold text-[#004e98] hover:underline"
          >
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="h-auto gap-1.5 bg-slate-100 p-1 rounded-xl">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold data-[selected]:bg-[#0f172a] data-[selected]:text-white data-[selected]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {displayed.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <Package className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {activeTab ? "Aucune location avec ce statut" : "Aucune location pour le moment"}
            </p>
            {!activeTab && (
              <Link href="/catalogue" className="mt-4 inline-block">
                <Button className="rounded-xl bg-[#ff6700] text-white hover:bg-[#e55f00] text-sm">
                  Parcourir le catalogue
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((loc) => (
              <LocationItem key={loc._id} loc={loc} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
