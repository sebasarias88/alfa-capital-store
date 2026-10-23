import type { Metadata } from "next";
import { Checkout } from "@/components/store/checkout";

export const metadata: Metadata = { title: "Finalizar pedido", robots: { index: false } };

export default function CheckoutPage() {
  return <Checkout />;
}
