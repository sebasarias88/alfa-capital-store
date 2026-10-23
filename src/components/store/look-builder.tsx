"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCartStore } from "@/store/cart-store";
import { ProductMedia } from "@/components/product-media";
import { cn, formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

const STEPS: { category: Category; title: string }[] = [
  { category: "perfumes", title: "Tu perfume" },
  { category: "watches", title: "Tu reloj" },
  { category: "sunglasses", title: "Tus gafas" },
];

export function LookBuilder() {
  const products = useAppStore((s) => s.products);
  const comboDiscount = useAppStore((s) => s.settings.comboDiscount);
  const addCombo = useCartStore((s) => s.addCombo);
  const [picked, setPicked] = useState<Partial<Record<Category, string>>>({});

  const selected = STEPS.map((s) => products.find((p) => p.id === picked[s.category])).filter((p): p is Product => !!p);
  const subtotal = selected.reduce((s, p) => s + p.price, 0);
  const complete = selected.length === 3;
  const discount = complete ? Math.round((subtotal * comboDiscount) / 100 / 100) * 100 : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-40 sm:px-6 sm:pt-16 lg:pb-24">
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-2"><Sparkles className="size-3.5" /> Combo exclusivo web</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl sm:text-7xl">
          Arma tu <span className="text-gold-gradient italic">look</span>
        </h1>
        <p className="mt-4 text-muted">
          Elige una pieza de cada categoría. Con las tres juntas obtienes <strong className="text-gold-bright">{comboDiscount}% de descuento</strong> en todo el combo.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-12">
          {STEPS.map((step, si) => (
            <section key={step.category} aria-labelledby={`step-${step.category}`}>
              <div className="flex items-center gap-3">
                <span className={cn("grid size-8 place-items-center rounded-full text-sm font-bold", picked[step.category] ? "bg-gold text-ink" : "border border-line text-muted")}>
                  {picked[step.category] ? <Check className="size-4" /> : si + 1}
                </span>
                <h2 id={`step-${step.category}`} className="font-[family-name:var(--font-display)] text-3xl">{step.title}</h2>
              </div>
              <div className="no-scrollbar -mx-4 mt-5 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                {products
                  .filter((p) => p.active && p.category === step.category && p.stock > 0)
                  .map((p) => {
                    const active = picked[step.category] === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setPicked((s) => ({ ...s, [step.category]: active ? undefined : p.id }))}
                        className={cn(
                          "group relative w-40 shrink-0 snap-start rounded-2xl border p-3 text-left transition sm:w-44",
                          active ? "border-gold bg-gold/10" : "border-line bg-surface hover:border-gold/40",
                        )}
                      >
                        {active && (
                          <span className="absolute top-2 right-2 z-10 grid size-6 place-items-center rounded-full bg-gold text-ink">
                            <Check className="size-3.5" />
                          </span>
                        )}
                        <div className="aspect-square transition group-hover:scale-105">
                          <ProductMedia product={p} />
                        </div>
                        <p className="mt-2 truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-gold-bright">{formatPrice(p.price)}</p>
                      </button>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>

        <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-coal/95 p-4 backdrop-blur-xl lg:sticky lg:top-28 lg:inset-auto lg:self-start lg:rounded-3xl lg:border lg:p-6">
          <h2 className="hidden font-[family-name:var(--font-display)] text-3xl lg:block">Tu look</h2>
          <div className="relative hidden h-64 lg:mt-4 lg:block">
            <AnimatePresence>
              {selected.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="absolute w-1/2"
                  style={{ left: `${i * 25}%`, top: i === 1 ? 0 : 40, zIndex: i === 0 ? 3 : 2 }}
                >
                  <ProductMedia product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
            {selected.length === 0 && (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-line text-sm text-faint">Elige tus piezas</div>
            )}
          </div>
          <div className="flex items-center gap-2 lg:mt-4">
            {STEPS.map((s) => (
              <span key={s.category} className={cn("h-1 flex-1 rounded-full", picked[s.category] ? "bg-gold" : "bg-line")} />
            ))}
          </div>
          <div className="mt-3 flex items-end justify-between gap-4 lg:mt-5">
            <div>
              <p className="text-xs text-muted">{selected.length}/3 piezas</p>
              {discount > 0 && <p className="text-xs text-success">Ahorras {formatPrice(discount)}</p>}
            </div>
            <div className="text-right">
              {discount > 0 && <p className="text-xs text-faint line-through">{formatPrice(subtotal)}</p>}
              <p className="font-[family-name:var(--font-display)] text-3xl text-gold-bright">{formatPrice(subtotal - discount)}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={!complete}
            onClick={() => {
              addCombo(selected.map((p) => p.id));
              setPicked({});
            }}
            className="btn-gold mt-4 w-full py-4"
          >
            {complete ? "Agregar look al carrito" : `Elige ${3 - selected.length} pieza${3 - selected.length === 1 ? "" : "s"} más`}
          </button>
        </aside>
      </div>
    </div>
  );
}
