"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { SEED_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/format";
import { useScrollMode } from "@/lib/use-scroll-mode";
import type { Category } from "@/lib/types";

const WORLDS: { category: Category; title: string; italic: string; text: string; slug: string; count: string }[] = [
  {
    category: "perfumes",
    title: "Perfumería",
    italic: "que enamora",
    text: "Originales sellados y las mejores inspiraciones 1.1 del mercado: duración real, botella premium y el aroma que estabas buscando.",
    slug: "oud-imperial",
    count: "12 fragancias",
  },
  {
    category: "watches",
    title: "Relojes",
    italic: "con carácter",
    text: "Cronógrafos, automáticos y piezas minimalistas para completar tu estilo. Cada detalle marca la diferencia.",
    slug: "monarch-skeleton",
    count: "6 modelos",
  },
  {
    category: "sunglasses",
    title: "Gafas",
    italic: "con actitud",
    text: "Aviador, ojo de gato, espejadas o vintage. Protección UV400 y el toque final para cualquier outfit.",
    slug: "cat-eye-noir",
    count: "6 estilos",
  },
];

const products = WORLDS.map((w) => SEED_PRODUCTS.find((p) => p.slug === w.slug)!);

/**
 * Sticky scroll storytelling. All three panels stay mounted and only their
 * opacity/transform change, so a fast scroll can never leave the section empty.
 */
export function WorldsScroll() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const mode = useScrollMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(WORLDS.length - 1, Math.max(0, Math.floor(v * WORLDS.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  return (
    <section ref={ref} aria-label="Nuestras líneas" className="sd-worlds relative h-[300svh] bg-coal">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* background glow + giant word, one per world, cross-faded */}
        <div aria-hidden className="absolute inset-0">
          {WORLDS.map((w, i) => (
            <div key={w.category} className={cn("absolute inset-0 transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")}>
              <div className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 70% 50%, ${products[i].art.accent}22, transparent 70%)` }} />
              <p className="absolute right-0 bottom-[-4vw] left-0 text-center font-[family-name:var(--font-display)] text-[22vw] leading-none font-semibold text-white/[0.025] select-none">
                {w.title.toUpperCase()}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div className="order-2 min-w-0 lg:order-1">
            <div className="flex items-center gap-4">
              {WORLDS.map((w, i) => (
                <span key={w.category} className={cn("text-xs tracking-[0.3em] transition-colors", i === active ? "text-gold" : "text-faint")}>
                  0{i + 1}
                </span>
              ))}
              <span className="relative ml-2 h-px flex-1 bg-line">
                {mode === "css" ? (
                  <span className="sd-worlds-progress absolute inset-0 origin-left bg-gold" />
                ) : mode === "js" ? (
                  <motion.span style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-gold" />
                ) : (
                  <span
                    className="absolute inset-0 origin-left bg-gold transition-[scale] duration-500 ease-out"
                    style={{ scale: `${(active + 1) / WORLDS.length} 1` }}
                  />
                )}
              </span>
            </div>

            {/* all texts share the same grid cell; only the active one is visible */}
            <div className="mt-8 grid">
              {WORLDS.map((w, i) => (
                <div
                  key={w.category}
                  aria-hidden={i !== active}
                  className={cn(
                    "[grid-area:1/1] transition-[opacity,translate,scale,rotate] duration-500 ease-out",
                    i === active ? "translate-y-0 opacity-100" : cn("pointer-events-none opacity-0", i < active ? "-translate-y-6" : "translate-y-6"),
                  )}
                >
                  <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,6rem)] leading-[0.95]">
                    {w.title}
                    <br />
                    <span className="text-gold-gradient italic">{w.italic}</span>
                  </h2>
                  <p className="mt-6 max-w-md leading-relaxed text-muted">{w.text}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link href={`/catalog?category=${w.category}`} tabIndex={i === active ? 0 : -1} className="btn-gold group">
                      Explorar {w.title.toLowerCase()}
                      <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <span className="text-xs tracking-[0.2em] text-muted uppercase">{w.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 mx-auto aspect-square w-[min(72vw,520px)] lg:order-2">
            <div className="absolute inset-[6%] rounded-full border border-gold/15" />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-gold/10" />
            {products.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "absolute inset-0 transition-[opacity,translate,scale,rotate] duration-700 ease-out will-change-transform",
                  i === active ? "scale-100 rotate-0 opacity-100" : cn("scale-75 opacity-0", i < active ? "rotate-12" : "-rotate-12"),
                )}
              >
                <ProductArt art={p.art} label={p.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
