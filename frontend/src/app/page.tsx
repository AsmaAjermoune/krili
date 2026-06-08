import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeLandingClient, {
  type CategoryItem,
  type FeaturedItem,
} from "@/components/landing/HomeLandingClient";
import { getCategories, getFeaturedMateriels } from "@/lib/api";

const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    _id: "1",
    nom: "BTP & Chantier",
    slug: "btp-chantier",
    subtitle: "Construction",
    image:
      "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2",
    nom: "Outillage Pro",
    slug: "outillage-pro",
    subtitle: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3",
    nom: "Événementiel",
    slug: "evenementiel",
    subtitle: "Events",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "4",
    nom: "Électronique",
    slug: "electronique",
    subtitle: "Industrie",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
];

const FALLBACK_FEATURED: FeaturedItem[] = [
  {
    _id: "f1",
    nom: "Pelle Hydraulique 3.5T",
    localisation: "Agadir",
    prixParJour: 100,
    caution: 5000,
    categorie: "BTP",
    image:
      "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "f2",
    nom: "Perceuse à Percussion",
    localisation: "Agadir",
    prixParJour: 100,
    caution: 1000,
    categorie: "Outillage",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "f3",
    nom: "Projecteur LED 200W",
    localisation: "Agadir",
    prixParJour: 100,
    caution: 2000,
    categorie: "Event",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
  },
  {
    _id: "f4",
    nom: "Bétonnière Électrique",
    localisation: "Agadir",
    prixParJour: 100,
    caution: 1500,
    categorie: "BTP",
    image:
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=600&q=80",
  },
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
  } catch {
    /* use fallback */
  }

  try {
    const apiFeatured = await getFeaturedMateriels(4);
    if (apiFeatured.length > 0) {
      featured = apiFeatured.map((m, i) => ({
        _id: m._id,
        nom: m.nom,
        localisation: m.localisation ?? "Maroc",
        prixParJour: m.prixParJour,
        caution: m.caution ?? 0,
        categorie:
          typeof m.categorieId === "object" ? (m.categorieId?.nom ?? "") : "",
        image:
          m.photos?.[0]?.url ??
          FALLBACK_FEATURED[i % FALLBACK_FEATURED.length]!.image,
      }));
    }
  } catch {
    /* use fallback */
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HomeLandingClient categories={categories} featured={featured} />
      <Footer />
    </div>
  );
}
