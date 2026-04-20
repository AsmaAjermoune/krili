import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getCategories, getFeaturedMateriels } from "@/lib/api";
import "./animations.css";

interface CategoryItem {
  _id: string;
  nom: string;
  slug: string;
  subtitle: string;
  image: string;
}

interface FeaturedItem {
  _id: string;
  nom: string;
  localisation: string;
  prixParJour: number;
  caution: number;
  categorie: string;
  image: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { _id: "1", nom: "BTP & Chantier", slug: "btp-chantier", subtitle: "Construction", image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=800&q=80" },
  { _id: "2", nom: "Outillage Pro", slug: "outillage-pro", subtitle: "Maintenance", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80" },
  { _id: "3", nom: "Événementiel", slug: "evenementiel", subtitle: "Events", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80" },
  { _id: "4", nom: "Électronique", slug: "electronique", subtitle: "Industrie", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
];

const FALLBACK_FEATURED: FeaturedItem[] = [
  { _id: "f1", nom: "Pelle Hydraulique 3.5T", localisation: "Agadir", prixParJour: 100, caution: 5000, categorie: "BTP", image: "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=600&q=80" },
  { _id: "f2", nom: "Perceuse à Percussion", localisation: "Agadir", prixParJour: 100, caution: 1000, categorie: "Outillage", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80" },
  { _id: "f3", nom: "Projecteur LED 200W", localisation: "Agadir", prixParJour: 100, caution: 2000, categorie: "Event", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80" },
  { _id: "f4", nom: "Bétonnière Électrique", localisation: "Agadir", prixParJour: 100, caution: 1500, categorie: "BTP", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=600&q=80" },
];

export default async function Home() {
  let categories = FALLBACK_CATEGORIES;
  let featured: FeaturedItem[] = FALLBACK_FEATURED;

  try {
    const apiCategories = await getCategories();
    if (apiCategories.length > 0) {
      categories = apiCategories.slice(0, 4).map((c, i) => ({
        _id: c._id,
        nom: c.nom,
        slug: c._id,
        subtitle: FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length]!.subtitle,
        image: c.image ?? FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length]!.image,
      }));
    }
  } catch { /* use fallback */ }

  try {
    const apiFeatured = await getFeaturedMateriels(4);
    if (apiFeatured.length > 0) {
      featured = apiFeatured.map((m, i) => ({
        _id: m._id,
        nom: m.nom,
        localisation: m.localisation ?? "Maroc",
        prixParJour: m.prixParJour,
        caution: m.caution ?? 0,
        categorie: typeof m.categorieId === "object" ? (m.categorieId?.nom ?? "") : "",
        image: m.photos?.[0]?.url ?? FALLBACK_FEATURED[i % FALLBACK_FEATURED.length]!.image,
      }));
    }
  } catch { /* use fallback */ }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden" style={{ paddingTop: "27.5px", paddingBottom: "27.5px" }}>
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=1920&q=80" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,78,152,0.85)" }} />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1024px] flex-col items-center gap-8 px-4 py-24">
          <h1 className="font-display font-black text-center text-white animate-fade-in-up" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", lineHeight: "1" }}>
            La référence de la location<br /><span style={{ color: "#ff6700" }}>professionnelle</span> au Maroc
          </h1>
          <p className="max-w-[768px] text-center text-[20px] font-light leading-[32.5px] animate-fade-in-up animation-delay-200" style={{ color: "rgba(255,255,255,0.9)" }}>
            Équipez vos chantiers, vos événements et vos ateliers avec du matériel de haute performance. Plus de 5000 références disponibles immédiatement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in-up animation-delay-400">
            <Link href="/catalogue" className="rounded-[24px] px-8 py-[18px] text-[18px] font-black text-white transition-transform hover:scale-105" style={{ backgroundColor: "#ff6700" }}>
              Trouver du matériel
            </Link>
            <Link href="/catalogue" className="rounded-[24px] border-2 border-white/30 px-[34px] py-[18px] text-[18px] font-black text-white transition-colors hover:bg-white/10" style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(255,255,255,0.1)" }}>
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-display font-black text-[36px] tracking-[-0.9px] animate-fade-in-up opacity-0" style={{ color: "#0f172a" }}>Nos catégories</h2>
              <div className="h-[6px] w-24 rounded-full animate-scale-in opacity-0" style={{ backgroundColor: "#ff6700", animationDelay: "0.3s" }} />
            </div>
            <p className="max-w-[448px] text-[16px] font-medium leading-[24px] animate-fade-in-up opacity-0 animation-delay-200" style={{ color: "#64748b" }}>
              Explorez nos solutions de location adaptées à chaque secteur d&apos;activité professionnel.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Link key={cat._id} href={`/catalogue?categorie=${cat._id}`} className={`group relative h-[400px] overflow-hidden rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] block animate-fade-in-up opacity-0`} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <Image src={cat.image} alt={cat.nom} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-8 pb-[52px] pt-8">
                  <span className="text-[14px] font-bold uppercase tracking-[1.4px]" style={{ color: "#ff6700" }}>{cat.subtitle}</span>
                  <span className="text-[24px] font-black leading-[32px] text-white">{cat.nom}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-24" style={{ backgroundColor: "#ebebeb" }}>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-4">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-display font-black text-[36px] tracking-[-0.9px] animate-fade-in-up opacity-0" style={{ color: "#0f172a" }}>Disponible maintenant près de vous</h2>
              <p className="text-[16px] font-medium animate-fade-in-up opacity-0 animation-delay-200" style={{ color: "#475569" }}>Les matériels les plus demandés à Agadir cette semaine.</p>
            </div>
            <Link href="/catalogue" className="flex shrink-0 items-center gap-2 text-[16px] font-black transition-opacity hover:opacity-70 animate-slide-in-left opacity-0" style={{ color: "#004e98" }}>
              Explorer tout le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {featured.map((item, i) => (
              <Link key={item._id} href={`/materiel/${item._id}`} className={`group flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-lg animate-fade-in-up opacity-0`} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="relative h-[224px] overflow-hidden bg-[#f1f5f9]">
                  <Image src={item.image} alt={item.nom} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 50vw, 25vw" />
                  <div className="absolute left-4 top-4 rounded-full px-3 py-1" style={{ backgroundColor: "#004e98" }}>
                    <span className="text-[10px] font-black uppercase tracking-[1px] text-white">{item.categorie || "—"}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-[16px] w-[16px] shrink-0" style={{ color: "#94a3b8" }} />
                    <span className="text-[12px] font-bold uppercase tracking-[0.6px]" style={{ color: "#94a3b8" }}>{item.localisation}</span>
                  </div>
                  <h3 className="font-display font-black text-[20px] leading-[28px]" style={{ color: "#0f172a" }}>{item.nom}</h3>
                  <div className="flex items-baseline gap-1 pb-4 pt-2">
                    <span className="text-[24px] font-black" style={{ color: "#ff6700" }}>{item.prixParJour} DH</span>
                    <span className="text-[14px] font-medium" style={{ color: "#64748b" }}>/ jour</span>
                  </div>
                  <div className="flex w-full items-center justify-center rounded-[24px] py-4 text-[16px] font-black text-white transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: "#ff6700", boxShadow: "0px 4px 6px -1px rgba(255,103,0,0.1), 0px 2px 4px -2px rgba(255,103,0,0.1)" }}>
                    Voir les détails
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA + Stats */}
      <section style={{ backgroundColor: "#004e98" }} className="py-20">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-16 px-4">
          <div className="flex min-w-0 flex-1 flex-col gap-6 animate-slide-in-left opacity-0">
            <h2 className="font-display font-black text-[36px] leading-[40px] text-white">
              Rejoignez l&apos;écosystème <span style={{ color: "#ff6700" }}>Kreli</span>
            </h2>
            <p className="max-w-[512px] text-[18px] font-light leading-[29.25px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Nous transformons la manière dont les professionnels marocains accèdent aux ressources de production.
            </p>
          </div>
          <div className="flex shrink-0 gap-16">
            {[
              { value: "5k+", label: "Articles" },
              { value: "12k+", label: "Contrats" },
              { value: "98%", label: "Satis." },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center gap-2 animate-fade-in-up opacity-0`} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                <span className="text-[48px] font-black leading-[48px] text-white">{s.value}</span>
                <span className="text-[12px] font-black uppercase tracking-[2.4px]" style={{ color: "#ff6700" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
