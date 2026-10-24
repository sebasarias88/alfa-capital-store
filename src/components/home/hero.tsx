"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { SEED_PRODUCTS } from "@/data/products";
import { useScrollMode } from "@/lib/use-scroll-mode";

const hero = SEED_PRODUCTS.find((p) => p.slug === "noir-absolu")!;
const watch = SEED_PRODUCTS.find((p) => p.slug === "capital-chrono-42")!;
const glasses = SEED_PRODUCTS.find((p) => p.slug === "aviator-gold")!;

/** CSS entrance delay — runs as soon as the HTML arrives, without waiting for JavaScript */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mode = useScrollMode();
  const js = mode === "js";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const watchY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const glassesY = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Tilt that follows the mouse (desktop only — skipped on touch screens)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="grain relative -mt-16 overflow-hidden pt-16 sm:-mt-20 sm:pt-20"
    >
      {/* ambient light (gradients instead of blur filters) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow-gold absolute top-[-25%] right-[-25%] size-[110vw] max-w-[1100px]" />
        <div className="glow-gold absolute bottom-[-35%] left-[-30%] size-[90vw] max-w-[800px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,106,0.05)_1px,transparent_1px)] bg-[size:120px_100%]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-0">
        <motion.div style={js ? { opacity: fade } : undefined} className="sd-hero-fade relative z-10 pt-6 lg:pt-0">
          <p className="eyebrow flex animate-rise items-center gap-3" style={delay(50)}>
            <span className="h-px w-10 bg-gold" /> Armenia · Quindío
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92] font-medium tracking-tight">
            <span className="inline-block animate-rise" style={delay(120)}>
              El arte de
            </span>
            <br />
            <span className="inline-block animate-rise" style={delay(280)}>
              <span className="animate-shimmer text-gold-gradient italic">dejar huella</span>
            </span>
          </h1>
          <p className="mt-8 max-w-md animate-rise text-base leading-relaxed text-muted sm:text-lg" style={delay(420)}>
            Perfumes originales e inspiraciones 1.1, relojes y gafas para dama y caballero. Te lo llevamos{" "}
            <span className="text-cream">gratis</span> a cualquier lugar de Armenia.
          </p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3" style={delay(540)}>
            <Link href="/catalog" className="btn-gold group px-7 py-4">
              Ver catálogo <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/quiz" className="btn-ghost px-7 py-4">
              <Sparkles className="size-4 text-gold" /> Encuentra tu aroma
            </Link>
          </div>
          <dl className="mt-14 hidden max-w-md animate-fade grid-cols-3 gap-6 border-t border-line pt-6 sm:grid" style={delay(700)}>
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
          </dl>
        </motion.div>

        {/* product composition */}
        <div className="relative mx-auto aspect-square w-full max-w-[360px] animate-fade [perspective:1200px] sm:max-w-[560px]" style={delay(150)}>
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow text-gold/70 will-change-transform" aria-hidden>
            <defs>
              <path id="ring" d="M200 200 m-170 0 a170 170 0 1 1 340 0 a170 170 0 1 1 -340 0" />
            </defs>
            <circle cx="200" cy="200" r="188" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 8" />
            <text fontSize="11" letterSpacing="6" fill="currentColor" fontFamily="var(--font-sans)">
              <textPath href="#ring">ALFA CAPITAL · PERFUMERÍA · RELOJES · GAFAS · ESTILO PARA DAMA Y CABALLERO ·</textPath>
            </text>
          </svg>
          {/* static glow behind the bottle (replaces an animated drop-shadow filter) */}
          <div aria-hidden className="glow-gold absolute inset-[12%]" />
          <motion.div style={js ? { y: watchY } : undefined} className="sd-hero-watch absolute top-[6%] left-[-2%] w-[34%] will-change-transform">
            <div className="animate-rise -rotate-12" style={delay(600)}>
              <ProductArt art={watch.art} label={watch.name} />
            </div>
          </motion.div>
          <motion.div style={js ? { y, rotate, scale, rotateX: tiltX, rotateY: tiltY } : { rotateX: tiltX, rotateY: tiltY }} className="sd-hero-bottle absolute inset-[10%] will-change-transform">
            <div className="h-full w-full animate-rise" style={delay(250)}>
              <ProductArt art={hero.art} label={hero.name} />
            </div>
          </motion.div>
          <motion.div style={js ? { y: glassesY } : undefined} className="sd-hero-glasses absolute right-[-4%] bottom-[2%] w-[44%] will-change-transform">
            <div className="animate-rise rotate-6" style={delay(750)}>
              <ProductArt art={glasses.art} label={glasses.name} />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div style={js ? { opacity: fade } : undefined} className="sd-hero-fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.4em] text-muted uppercase sm:flex">
        Desliza
        <span className="h-10 w-px overflow-hidden bg-line">
          <motion.span className="block h-4 w-px bg-gold" animate={{ y: [-16, 40] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}
