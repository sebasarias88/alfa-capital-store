"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductMedia } from "@/components/product-media";
import { EditionBadge } from "./edition-badge";
import { CATEGORY_LABEL, GENDER_LABEL } from "@/lib/labels";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCartStore((s) => s.add);
  const soldOut = product.stock <= 0;
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line/70 bg-gradient-to-b from-raised to-coal transition duration-500 group-hover:border-gold/40">
        <Link href={`/product/${product.slug}`} aria-label={`Ver ${product.name}`} className="absolute inset-0 z-10" />
        <div className="absolute inset-0 p-4 transition duration-700 ease-out group-hover:scale-[1.06]">
          <ProductMedia product={product} />
        </div>
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5">
          <EditionBadge edition={product.edition} />
          {product.isNew && <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-bold tracking-wider text-ink uppercase">Nuevo</span>}
          {off > 0 && <span className="rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-bold text-white">-{off}%</span>}
        </div>
        {soldOut ? (
          <span className="absolute inset-x-3 bottom-3 z-20 rounded-full bg-ink/80 py-2.5 text-center text-xs font-semibold text-muted backdrop-blur">
            Agotado
          </span>
        ) : (
          <button
            type="button"
            onClick={() => add(product.id)}
            aria-label={`Agregar ${product.name} al carrito`}
            className="absolute right-3 bottom-3 z-20 flex h-11 items-center gap-2 rounded-full bg-gold px-4 text-xs font-bold text-ink shadow-lg transition hover:bg-gold-bright sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        )}
      </div>
      <div className="mt-4 px-1">
        <p className="truncate text-[10px] tracking-[0.2em] text-muted uppercase sm:text-[11px]">
          {product.house} · {product.category === "perfumes" ? GENDER_LABEL[product.gender] : CATEGORY_LABEL[product.category]}
        </p>
        <h3 className="mt-1 truncate font-[family-name:var(--font-display)] text-xl text-cream sm:text-2xl">{product.name}</h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold text-gold-bright">{formatPrice(product.price)}</span>
          {product.compareAt && <span className="text-xs text-faint line-through">{formatPrice(product.compareAt)}</span>}
        </p>
      </div>
    </motion.article>
  );
}
