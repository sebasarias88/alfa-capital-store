"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { ProductCard } from "@/components/store/product-card";
import { cn } from "@/lib/format";
import type { Gender } from "@/lib/types";

const TABS: { id: "all" | Gender; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "women", label: "Dama" },
  { id: "men", label: "Caballero" },
];

export function Featured() {
  const products = useAppStore((s) => s.products);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const list = products
    .filter((p) => p.active && p.featured)
    .filter((p) => tab === "all" || p.gender === tab || p.gender === "unisex")
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Lo más pedido</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl sm:text-6xl">
            Favoritos de <span className="text-gold-gradient italic">la casa</span>
          </h2>
        </div>
        <div role="tablist" aria-label="Filtrar por público" className="flex gap-1 rounded-full border border-line p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm transition",
                tab === t.id ? "bg-gold font-semibold text-ink" : "text-muted hover:text-cream",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <Link href="/catalog" className="btn-ghost group">
          Ver todo el catálogo <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
