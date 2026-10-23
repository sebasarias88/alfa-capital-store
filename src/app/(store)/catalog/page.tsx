import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/store/catalog-view";

export const metadata: Metadata = {
  alternates: { canonical: "/catalog" },
  title: "Catálogo",
  description: "Perfumes originales e inspiraciones 1.1, relojes y gafas. Domicilio gratis en Armenia.",
};

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
