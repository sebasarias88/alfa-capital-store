/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductArt } from "./product-art";

/** Shows the uploaded photo if there is one, otherwise the placeholder illustration */
export function ProductMedia({ product, className }: { product: Product; className?: string }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  }
  return (
    <ProductArt
      art={product.art}
      label={product.category === "perfumes" ? product.name : undefined}
      className={cn("h-full w-full", className)}
    />
  );
}
