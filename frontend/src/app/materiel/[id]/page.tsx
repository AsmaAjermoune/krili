import { notFound } from "next/navigation";
import { getMateriel, getSimilarMateriels, type Materiel } from "@/lib/api";
import MaterielDetailClient from "./MaterielDetailClient";

export default async function MaterielPage({
  params,
}: {
  params: { id: string };
}) {
  let materiel: Materiel;

  try {
    materiel = await getMateriel(params.id);
  } catch {
    notFound();
  }

  let similar: Materiel[] = [];
  try {
    similar = await getSimilarMateriels(params.id);
  } catch {
    /* no similar */
  }

  return <MaterielDetailClient materiel={materiel} similar={similar} />;
}
