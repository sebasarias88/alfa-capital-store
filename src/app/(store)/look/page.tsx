import type { Metadata } from "next";
import { LookBuilder } from "@/components/store/look-builder";

export const metadata: Metadata = {
  alternates: { canonical: "/look" },
  title: "Arma tu look",
  description: "Combina perfume, reloj y gafas y obtén un descuento especial en el combo.",
};

export default function LookPage() {
  return <LookBuilder />;
}
