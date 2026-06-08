import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { getMateriel, getSimilarMateriels, getMaterielImage, type Materiel } from "@/lib/api";
import MaterielDetailClient from "./MaterielDetailClient";

type Props = { params: { id: string } };

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  let materiel: Materiel;
  try {
    materiel = await getMateriel(params.id);
  } catch {
    return { title: "Matériel introuvable" };
  }

  const title = materiel.nom;
  const description = materiel.description
    ? materiel.description.slice(0, 160)
    : `Louez ${materiel.nom} au Maroc — ${materiel.prixParJour} MAD/jour${materiel.localisation ? " \u00e0 " + materiel.localisation : ""}.`;
  const imageUrl = getMaterielImage(materiel);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Kreli`,
      description,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Kreli`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function MaterielPage({ params }: Props) {
  let materiel: Materiel;

  try {
    materiel = await getMateriel(params.id);
  } catch {
    notFound();
  }

  let similar: Materiel[] = [];
  try {
    similar = await getSimilarMateriels(params.id);
  } catch { }

  return <MaterielDetailClient materiel={materiel} similar={similar} />;
}
