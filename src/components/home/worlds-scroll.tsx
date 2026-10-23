"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { SEED_PRODUCTS } from "@/data/products";
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

export function WorldsScroll() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(WORLDS.length - 1, Math.floor(v * WORLDS.length));
    if (i !== active) setActive(i);
  });

  const world = WORLDS[active];
  const product = SEED_PRODUCTS.find((p) => p.slug === world.slug)!;

  return (
    <section ref={ref} aria-label="Nuestras líneas" className="relative h-[300svh] bg-coal">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={world.category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
              style={{ background: `radial-gradient(60% 60% at 70% 50%, ${product.art.accent}22, transparent 70%)` }}
            />
          </AnimatePresence>
          <p className="absolute right-0 bottom-[-4vw] left-0 text-center font-[family-name:var(--font-display)] text-[22vw] leading-none font-semibold text-white/[0.025] select-none">
            {world.title.toUpperCase()}
          </p>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-4">
              {WORLDS.map((w, i) => (
                <span key={w.category} className={`text-xs tracking-[0.3em] transition ${i === active ? "text-gold" : "text-faint"}`}>
                  0{i + 1}
                </span>
              ))}
              <span className="relative ml-2 h-px flex-1 bg-line">
                <motion.span style={{ width: progress }} className="absolute inset-y-0 left-0 bg-gold" />
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={world.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="mt-8 font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,6rem)] leading-[0.95]">
                  {world.title}
                  <br />
                  <span className="text-gold-gradient italic">{world.italic}</span>
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-muted">{world.text}</p>
                <div className="mt-8 flex items-center gap-6">
                  <Link href={`/catalog?category=${world.category}`} className="btn-gold group">
                    Explorar {world.title.toLowerCase()}
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <span className="text-xs tracking-[0.2em] text-muted uppercase">{world.count}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative order-1 mx-auto aspect-square w-[min(78vw,520px)] lg:order-2">
            <div className="absolute inset-[6%] rounded-full border border-gold/15" />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-gold/10" />
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.7, rotate: -25, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.15, rotate: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ProductArt art={product.art} label={product.name} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
