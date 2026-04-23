  "use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice, getMateriels, getCategories, type Materiel, type Category } from "@/lib/api";

type SortOption = "pertinence" | "prix_asc" | "prix_desc" | "recent";
type DisponibiliteOption = "tous" | "disponible" | "reservation";
type ViewMode = "grid" | "list";

interface FilterPill {
  key: string;
  label: string;
  removeKey: string;
  removeValue: string | null;
}

const PAGE_SIZE = 12;
const PRICE_MAX = 10000;
const DEBOUNCE_DELAY = 300;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const VILLES = ["Casablanca", "Agadir", "Marrakech", "Rabat", "Fès", "Tanger"];

export default function CatalogueClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const q = searchParams.get("q") ?? "";
  const categorieParam = searchParams.get("categorie") ?? "";
  const selectedCategories = useMemo(
    () => (categorieParam ? categorieParam.split(",").filter(Boolean) : []),
    [categorieParam]
  );
  const prixMinParam = Number(searchParams.get("prix_min") ?? "0") || 0;
  const prixMaxParam = Number(searchParams.get("prix_max") ?? "0") || 0;
  const ville = searchParams.get("ville") ?? "";
  const disponibilite = (searchParams.get("disponibilite") ??
    "tous") as DisponibiliteOption;
  const sort = (searchParams.get("sort") ?? "pertinence") as SortOption;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [view, setView] = useState<ViewMode>("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    prixMinParam > 0 ? prixMinParam : 0,
    prixMaxParam > 0 ? prixMaxParam : PRICE_MAX,
  ]);

  useEffect(() => {
    setPriceRange([
      prixMinParam > 0 ? prixMinParam : 0,
      prixMaxParam > 0 ? prixMaxParam : PRICE_MAX,
    ]);
  }, [prixMinParam, prixMaxParam]);

  function pushFilter(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    if (!("page" in updates)) {
      params.delete("page");
    }
    const qs = params.toString();
    router.push(`/catalogue${qs ? `?${qs}` : ""}`);
  }

  function toggleCategory(slug: string) {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((s) => s !== slug)
      : [...selectedCategories, slug];
    pushFilter({ categorie: next.length ? next.join(",") : null });
  }

  function applyPriceRange(min: number, max: number) {
    pushFilter({
      prix_min: min > 0 ? String(min) : null,
      prix_max: max < PRICE_MAX ? String(max) : null,
    });
  }

  function resetFilters() {
    setPriceRange([0, PRICE_MAX]);
    router.push("/catalogue");
  }

  function setPageFilter(p: number) {
    pushFilter({ page: String(p) });
  }

  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getMateriels({
          q: debouncedQ || undefined,
          categorie: selectedCategories.length ? selectedCategories.join(",") : undefined,
          ville: ville || undefined,
          prixMin: prixMinParam > 0 ? prixMinParam : undefined,
          prixMax: prixMaxParam > 0 ? prixMaxParam : undefined,
          disponibilite: disponibilite !== "tous" ? disponibilite : undefined,
          page,
          limit: PAGE_SIZE,
          sort: sort === "prix_asc" ? "price_asc" : sort === "prix_desc" ? "price_desc" : sort === "recent" ? "recent" : undefined,
        });
        setMateriels(result.data);
        setTotal(result.total);
        setPages(result.pages);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategories, prixMinParam, prixMaxParam, ville, page, sort, debouncedQ, disponibilite]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        // silent
      }
    }
    loadCategories();
  }, []);

  const activePills = useMemo<FilterPill[]>(() => {
    const pills: FilterPill[] = [];
    if (q)
      pills.push({ key: "q", label: `"${q}"`, removeKey: "q", removeValue: null });
    selectedCategories.forEach((slug) => {
      const cat = categories.find((c) => c._id === slug);
      if (cat) {
        const rest = selectedCategories.filter((s) => s !== slug);
        pills.push({
          key: `cat-${slug}`,
          label: cat.nom,
          removeKey: "categorie",
          removeValue: rest.length ? rest.join(",") : null,
        });
      }
    });
    if (prixMinParam > 0)
      pills.push({ key: "prix_min", label: `≥ ${prixMinParam} DH/j`, removeKey: "prix_min", removeValue: null });
    if (prixMaxParam > 0)
      pills.push({ key: "prix_max", label: `≤ ${prixMaxParam} DH/j`, removeKey: "prix_max", removeValue: null });
    if (ville)
      pills.push({ key: "ville", label: ville, removeKey: "ville", removeValue: null });
    if (disponibilite !== "tous")
      pills.push({
        key: "disponibilite",
        label: disponibilite === "disponible" ? "Disponible maintenant" : "Sur réservation",
        removeKey: "disponibilite",
        removeValue: null,
      });
    return pills;
  }, [q, selectedCategories, prixMinParam, prixMaxParam, ville, disponibilite]);

  const hasFilters = activePills.length > 0;

  const sidebarContent = (
    <div className="flex flex-col gap-5 text-sm">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-ink">Rechercher</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nom du matériel..."
            value={q}
            onChange={(e) => pushFilter({ q: e.target.value || null })}
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-base font-black text-ink">Filtres</p>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-brand hover:text-brand-dark h-auto p-0">
          Réinitialiser
        </Button>
      </div>

      <Separator />

      {/* Catégorie */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-ink">Catégorie</p>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat._id);
            return (
              <label
                key={cat._id}
                className="flex cursor-pointer items-center gap-2.5"
                onClick={() => toggleCategory(cat._id)}
              >
                <Checkbox checked={checked} className="border-gray-300 data-[state=checked]:bg-brand data-[state=checked]:border-brand" />
                <span className="text-sm font-medium text-muted-foreground">
                  {cat.nom}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Prix / jour */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-ink">Prix / jour (DH)</p>
        <Slider
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          onValueCommitted={(val) => {
            const arr = val as readonly number[];
            applyPriceRange(arr[0], arr[1]);
          }}
          max={PRICE_MAX}
          step={100}
          className="py-2"
        />
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-md px-2 py-1 bg-muted font-medium">{priceRange[0].toLocaleString()} DH</span>
          <span className="text-muted-foreground">—</span>
          <span className="rounded-md px-2 py-1 bg-muted font-medium">
            {priceRange[1] >= PRICE_MAX ? `${PRICE_MAX.toLocaleString()}+ DH` : `${priceRange[1].toLocaleString()} DH`}
          </span>
        </div>
      </div>

      <Separator />

      {/* Ville */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-ink">Ville</p>
        <div className="grid grid-cols-2 gap-2">
          {VILLES.map((v) => {
            const active = ville === v;
            return (
              <Button
                key={v}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => pushFilter({ ville: active ? null : v })}
                className={active ? "bg-brand hover:bg-brand-dark" : ""}
              >
                {v}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Disponibilité */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-ink">Disponibilité</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">Disponible maintenant</span>
          <Switch
            checked={disponibilite === "disponible"}
            onCheckedChange={(checked) => pushFilter({ disponibilite: checked ? "disponible" : null })}
            className="data-[state=checked]:bg-brand"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ebebeb" }}>
      <Navbar />

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="flex items-start gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div
              className="sticky top-24 rounded-[16px] bg-white p-6"
              style={{
                boxShadow:
                  "0px 1px 3px 0px rgba(0,0,0,0.08), 0px 1px 2px -1px rgba(0,0,0,0.06)",
              }}
            >
              {sidebarContent}
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-[300px] overflow-y-auto bg-white p-6 shadow-xl">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="mb-5 ml-auto flex items-center justify-center"
                >
                  <X className="h-5 w-5" style={{ color: "#64748b" }} />
                </button>
                {sidebarContent}
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="min-w-0 flex-1">
            {/* Top bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-medium transition-colors hover:border-[#004e98] lg:hidden"
                  style={{ color: "#64748b" }}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                  {hasFilters && (
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: "#ff6700" }}
                    >
                      {activePills.length}
                    </span>
                  )}
                </button>
                <p className="text-[14px]" style={{ color: "#64748b" }}>
                  <span className="font-bold" style={{ color: "#0f172a" }}>
                    {total}
                  </span>{" "}
                  matériels trouvés
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) =>
                    pushFilter({
                      sort:
                        e.target.value === "pertinence"
                          ? null
                          : e.target.value,
                    })
                  }
                  className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-[14px] font-medium outline-none focus:border-[#004e98]"
                  style={{ color: "#0f172a" }}
                >
                  <option value="pertinence">Pertinence</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                  <option value="recent">Nouveautés</option>
                </select>

                {/* Grid / List toggle */}
                <div
                  className="flex items-center gap-1 rounded-xl border border-[#e2e8f0] bg-white p-1"
                >
                  <button
                    onClick={() => setView("grid")}
                    className="rounded-lg p-2 transition-colors"
                    style={{
                      color: view === "grid" ? "#ff6700" : "#94a3b8",
                      backgroundColor:
                        view === "grid"
                          ? "rgba(255,103,0,0.08)"
                          : "transparent",
                    }}
                    aria-label="Vue grille"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="rounded-lg p-2 transition-colors"
                    style={{
                      color: view === "list" ? "#ff6700" : "#94a3b8",
                      backgroundColor:
                        view === "list"
                          ? "rgba(255,103,0,0.08)"
                          : "transparent",
                    }}
                    aria-label="Vue liste"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {activePills.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {activePills.map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() =>
                      pushFilter({ [pill.removeKey]: pill.removeValue })
                    }
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#ff6700" }}
                  >
                    {pill.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {materiels.length === 0 && !loading ? (
              <div
                className="flex flex-col items-center justify-center rounded-[16px] bg-white py-24 text-center"
                style={{
                  boxShadow:
                    "0px 1px 3px 0px rgba(0,0,0,0.08), 0px 1px 2px -1px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#f1f5f9" }}
                >
                  <Search className="h-8 w-8 text-[#cbd5e1]" />
                </div>
                <p className="text-[16px] font-black" style={{ color: "#0f172a" }}>
                  Aucun matériel trouvé
                </p>
                <p className="mt-1 text-[14px]" style={{ color: "#64748b" }}>
                  Essayez d&apos;élargir vos critères de recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-full px-5 py-2 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#ff6700" }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Grid */}
                {view === "grid" ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {materiels.map((p) => (
                      <ProductCard key={p._id} product={p} view="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {materiels.map((p) => (
                      <ProductCard key={p._id} product={p} view="list" />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                  <Pagination
                    current={page}
                    total={pages}
                    onChange={setPageFilter}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProductCard({
  product,
  view,
}: {
  product: Materiel;
  view: ViewMode;
}) {
  const categorieNom = typeof product.categorieId === "object" ? product.categorieId?.nom : "Équipement";
  const imageUrl = product.photos?.[0]?.url || "/placeholder.jpg";
  const localisation = product.localisation || "Non spécifiée";

  if (view === "list") {
    return (
      <Link
        href={`/materiel/${product._id}`}
        className="group flex overflow-hidden rounded-[16px] bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.005]"
        style={{
          boxShadow:
            "0px 1px 3px 0px rgba(0,0,0,0.08), 0px 1px 2px -1px rgba(0,0,0,0.06)",
        }}
      >
        <div className="relative h-auto min-h-[160px] w-[180px] shrink-0 overflow-hidden bg-[#f8fafc]">
          <Image
            src={imageUrl}
            alt={product.nom}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="180px"
          />
          <span
            className="absolute left-3 top-3 rounded-[6px] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.5px]"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              color: "#ff6700",
            }}
          >
            {categorieNom}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div
              className="flex items-center gap-1 text-[12px]"
              style={{ color: "#64748b" }}
            >
              <MapPin
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "#ff6700" }}
              />
              {localisation}
            </div>
            <h3
              className="mt-2 text-[17px] font-black leading-snug"
              style={{ color: "#0f172a" }}
            >
              {product.nom}
            </h3>
          </div>
          <div>
            <div
              className="my-3 border-t"
              style={{ borderColor: "#f1f5f9" }}
            />
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "#94a3b8" }}
                >
                  Caution :{" "}
                </span>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: "#0f172a" }}
                >
                  {formatPrice(product.caution || 0)}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[20px] font-black"
                  style={{ color: "#ff6700" }}
                >
                  {formatPrice(product.prixParJour)}
                </span>
                <span className="text-[12px]" style={{ color: "#94a3b8" }}>
                  / jour
                </span>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <span
                className="rounded-[8px] px-4 py-2 text-[13px] font-bold transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "rgba(255,103,0,0.10)",
                  color: "#ff6700",
                }}
              >
                Voir les détails
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/materiel/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
      style={{
        boxShadow:
          "0px 1px 3px 0px rgba(0,0,0,0.08), 0px 1px 2px -1px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image */}
      <div className="relative h-[192px] overflow-hidden bg-[#f8fafc]">
        <Image
          src={imageUrl}
          alt={product.nom}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span
          className="absolute left-3 top-3 rounded-[6px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.5px]"
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            color: "#ff6700",
          }}
        >
          {categorieNom}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <div
          className="flex items-center gap-1 text-[12px]"
          style={{ color: "#64748b" }}
        >
          <MapPin
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "#ff6700" }}
          />
          <span className="truncate">{localisation}</span>
        </div>
        <h3
          className="mt-2 line-clamp-2 text-[17px] font-black leading-snug"
          style={{ color: "#0f172a" }}
        >
          {product.nom}
        </h3>

        <div
          className="my-3 border-t"
          style={{ borderColor: "#f1f5f9" }}
        />
        <div className="flex items-center gap-1.5">
          <span
            className="text-[11px] font-medium"
            style={{ color: "#94a3b8" }}
          >
            Caution :
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "#0f172a" }}
          >
            {formatPrice(product.caution || 0)}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span
              className="text-[20px] font-black"
              style={{ color: "#ff6700" }}
            >
              {formatPrice(product.prixParJour)}
            </span>
            <span className="text-[12px]" style={{ color: "#94a3b8" }}>
              / jour
            </span>
          </div>
          <span
            className="rounded-[8px] px-3 py-2 text-[13px] font-bold transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "rgba(255,103,0,0.10)",
              color: "#ff6700",
            }}
          >
            Voir les détails
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white transition-colors hover:border-[#004e98] disabled:opacity-30"
        style={{ color: "#64748b" }}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center text-sm"
            style={{ color: "#64748b" }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[14px] font-bold transition-colors"
            style={
              current === p
                ? { backgroundColor: "#004e98", color: "#ffffff" }
                : {
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    border: "1px solid #e2e8f0",
                  }
            }
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white transition-colors hover:border-[#004e98] disabled:opacity-30"
        style={{ color: "#64748b" }}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
