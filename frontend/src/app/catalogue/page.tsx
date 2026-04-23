import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogueClient from "./CatalogueClient";

export const metadata: Metadata = {
  title: "Catalogue — Kreli",
  description:
    "Parcourez des milliers d'équipements professionnels disponibles à la location partout au Maroc.",
};

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#ebebeb" }}
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-4"
            style={{ borderColor: "#004e98", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <CatalogueClient />
    </Suspense>
  );
}
