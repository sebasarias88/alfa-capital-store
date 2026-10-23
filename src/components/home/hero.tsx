"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { SEED_PRODUCTS } from "@/data/products";

const hero = SEED_PRODUCTS.find((p) => p.slug === "noir-absolu")!;
const watch = SEED_PRODUCTS.find((p) => p.slug === "capital-chrono-42")!;
const glasses = SEED_PRODUCTS.find((p) => p.slug === "aviator-gold")!;

const words = ["El", "arte", "de"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const watchY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const glassesY = useTransform(scrollYProgress, [0, 1], [0, 220]);

  // Subtle tilt that follows the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="grain relative -mt-16 overflow-hidden pt-16 sm:-mt-20 sm:pt-20"
    >
      {/* ambient light */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] size-[70vw] max-w-[900px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-20%] size-[60vw] max-w-[700px] rounded-full bg-gold-deep/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,106,0.05)_1px,transparent_1px)] bg-[size:120px_100%]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-0">
        <motion.div style={{ opacity: fade }} className="relative z-10 pt-6 lg:pt-0">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-gold" /> Armenia · Quindío
          </motion.p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92] font-medium tracking-tight">
            {words.map((w, i) => (
              <motion.span
                key={w}
                className="mr-[0.22em] inline-block"
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
            <br />
            <motion.span
              className="inline-block animate-shimmer text-gold-gradient italic"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              dejar huella
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            Perfumes originales e inspiraciones 1.1, relojes y gafas para dama y caballero. Te lo llevamos{" "}
            <span className="text-cream">gratis</span> a cualquier lugar de Armenia.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-10 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn-gold group px-7 py-4">
              Ver catálogo <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/quiz" className="btn-ghost px-7 py-4">
              <Sparkles className="size-4 text-gold" /> Encuentra tu aroma
            </Link>
          </motion.div>
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-14 hidden max-w-md grid-cols-3 gap-6 border-t border-line pt-6 sm:grid">
            {[
              ["+20", "Fragancias"],
              ["24h", "Entrega local"],
              ["$0", "Domicilio"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-[family-name:var(--font-display)] text-3xl text-gold-bright">{n}</dd>
                <dd className="mt-1 text-[11px] tracking-[0.2em] text-muted uppercase">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* product composition */}
        <div className="relative mx-auto aspect-square w-full max-w-[360px] [perspective:1200px] sm:max-w-[560px]">
          <motion.svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow text-gold/70" aria-hidden>
            <defs>
              <path id="ring" d="M200 200 m-170 0 a170 170 0 1 1 340 0 a170 170 0 1 1 -340 0" />
            </defs>
            <circle cx="200" cy="200" r="188" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 8" />
            <text fontSize="11" letterSpacing="6" fill="currentColor" fontFamily="var(--font-sans)">
              <textPath href="#ring">ALFA CAPITAL · PERFUMERÍA · RELOJES · GAFAS · ESTILO PARA DAMA Y CABALLERO ·</textPath>
            </text>
          </motion.svg>
          <motion.div
            style={{ y: watchY }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="absolute top-[6%] left-[-2%] w-[34%] -rotate-12"
          >
            <ProductArt art={watch.art} label={watch.name} />
          </motion.div>
          <motion.div
            style={{ y, rotate, scale, rotateX: tiltX, rotateY: tiltY }}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-[10%] drop-shadow-[0_40px_80px_rgba(212,175,106,0.25)]"
          >
            <ProductArt art={hero.art} label={hero.name} />
          </motion.div>
          <motion.div
            style={{ y: glassesY }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="absolute right-[-4%] bottom-[2%] w-[44%] rotate-6"
          >
            <ProductArt art={glasses.art} label={glasses.name} />
          </motion.div>
        </div>
      </div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.4em] text-muted uppercase sm:flex">
        Desliza
        <span className="h-10 w-px overflow-hidden bg-line">
          <motion.span className="block h-4 w-px bg-gold" animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}
