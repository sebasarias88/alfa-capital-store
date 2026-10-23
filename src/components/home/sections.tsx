"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, MessageCircle, Play, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { SEED_PRODUCTS } from "@/data/products";
import { useAppStore } from "@/store/app-store";
import { waLink } from "@/lib/whatsapp";

const bySlug = (slug: string) => SEED_PRODUCTS.find((p) => p.slug === slug)!;

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/* -------------------------------- Quiz CTA -------------------------------- */

export function QuizCta() {
  const bottles = ["rose-velours", "vanilla-cashmere", "bleu-riviera", "fleur-de-nuit", "citrus-capri"].map(bySlug);
  return (
    <section className="px-4 sm:px-6">
      <motion.div
        {...reveal}
        className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-raised via-surface to-coal px-6 py-16 sm:px-14 sm:py-20"
      >
        <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-gold/15 blur-[100px]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow flex items-center gap-2"><Sparkles className="size-3.5" /> Asesor de aromas</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[1] sm:text-6xl">
              ¿No sabes cuál elegir?
              <br />
              <span className="text-gold-gradient italic">Te ayudamos en 30 segundos.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted">
              Responde 4 preguntas rápidas sobre tu estilo y te recomendamos las fragancias perfectas para ti o para regalar.
            </p>
            <Link href="/quiz" className="btn-gold group mt-9 px-8 py-4">
              Hacer el test <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative flex h-72 items-end justify-center sm:h-96">
            {bottles.map((b, i) => (
              <motion.div
                key={b.id}
                className="-mx-6 w-40 sm:-mx-4 sm:w-48"
                style={{ zIndex: i === 2 ? 5 : 5 - Math.abs(2 - i) }}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: Math.abs(2 - i) * 22, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: Math.abs(2 - i) * 22 - 16 }}
              >
                <ProductArt art={b.art} label={b.name} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------- Look teaser ------------------------------ */

export function LookTeaser() {
  const comboDiscount = useAppStore((s) => s.settings.comboDiscount);
  const pieces = [bySlug("cuir-sauvage"), bySlug("capital-chrono-42"), bySlug("aviator-gold")];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <motion.div {...reveal}>
          <p className="eyebrow">Exclusivo de la web</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[1] sm:text-6xl">
            Arma tu <span className="text-gold-gradient italic">look completo</span>
          </h2>
          <p className="mt-6 max-w-md text-muted">
            Elige un perfume, un reloj y unas gafas. Si llevas las tres piezas juntas, te damos{" "}
            <strong className="text-gold-bright">{comboDiscount}% de descuento</strong> en todo el combo.
          </p>
          <Link href="/look" className="btn-gold group mt-9 px-8 py-4">
            Armar mi look <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {pieces.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40, rotate: i === 1 ? 0 : i === 0 ? -4 : 4 }}
              whileInView={{ opacity: 1, y: i === 1 ? -24 : 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8 }}
              className="relative flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border border-line bg-gradient-to-b from-raised to-coal p-3"
            >
              <span className="absolute top-3 left-3 text-[10px] tracking-[0.25em] text-gold">0{i + 1}</span>
              <ProductArt art={p.art} label={p.name} className="h-full w-full" />
              {i < 2 && (
                <span className="absolute top-1/2 -right-3 z-10 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-gold text-sm font-bold text-ink sm:-right-4 sm:size-7">
                  +
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Original vs 1.1 ----------------------------- */

export function EditionsExplainer() {
  return (
    <section className="border-y border-line bg-coal py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Transparencia total</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl sm:text-6xl">
            Sabes <span className="text-gold-gradient italic">exactamente</span> lo que compras
          </h2>
          <p className="mt-5 text-muted">Cada producto está marcado con su tipo para que elijas según tu presupuesto.</p>
        </motion.div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: BadgeCheck,
              title: "Original",
              tag: "Sellado de fábrica",
              text: "Productos originales de la casa, con su presentación y empaque oficial. La experiencia completa de la marca.",
              points: ["Empaque y lote original", "Máxima fidelidad del aroma", "Ideal para regalar"],
              solid: true,
            },
            {
              icon: Sparkles,
              title: "Inspiración 1.1",
              tag: "Excelente relación calidad-precio",
              text: "Fragancias inspiradas en los aromas más deseados, con alta concentración y gran duración a un precio accesible.",
              points: ["Aroma muy similar", "Alta fijación y proyección", "Precio mucho más accesible"],
              solid: false,
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 ${c.solid ? "border-gold/40 bg-gradient-to-br from-gold/15 to-transparent" : "border-line bg-surface"}`}
            >
              <c.icon className="size-9 text-gold" />
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-4xl">{c.title}</h3>
              <p className="mt-1 text-xs tracking-[0.2em] text-gold uppercase">{c.tag}</p>
              <p className="mt-5 max-w-md text-muted">{c.text}</p>
              <ul className="mt-6 space-y-2.5">
                {c.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-sm">
                    <span className="size-1.5 rounded-full bg-gold" /> {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Instagram feed ----------------------------- */

export function InstagramFeed() {
  const instagram = useAppStore((s) => s.settings.instagram);
  const tiles = [
    { slug: "rose-velours", caption: "Unboxing Rose Velours", bg: "from-[#3b1d27] to-[#120c0d]" },
    { slug: "noir-absolu", caption: "El aroma de la noche", bg: "from-[#2a2117] to-[#0d0b09]" },
    { slug: "monarch-skeleton", caption: "Detalles que importan", bg: "from-[#1f1a12] to-[#0b0a08]" },
    { slug: "cat-eye-noir", caption: "Look del día", bg: "from-[#261c2b] to-[#0c0a0d]" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">@{instagram}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl sm:text-6xl">
            Síguenos en <span className="text-gold-gradient italic">Instagram</span>
          </h2>
        </div>
        <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <Instagram className="size-4" /> Seguir
        </a>
      </div>
      <div className="no-scrollbar -mx-4 mt-12 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
        {tiles.map((t, i) => {
          const p = bySlug(t.slug);
          return (
            <motion.a
              key={t.slug}
              href={`https://www.instagram.com/${instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver reel: ${t.caption}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group relative aspect-[9/16] w-[62vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-line bg-gradient-to-b sm:w-auto ${t.bg}`}
            >
              <div className="absolute inset-x-0 top-[12%] bottom-[22%] transition duration-700 group-hover:scale-110">
                <ProductArt art={p.art} label={p.name} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/15 backdrop-blur">
                <Play className="size-4 fill-white text-white" />
              </span>
              <p className="absolute inset-x-4 bottom-4 text-sm font-medium">{t.caption}</p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------- How to buy ------------------------------- */

export function HowToBuy() {
  const steps = [
    { icon: ShoppingBag, title: "Elige", text: "Agrega tus favoritos al carrito o arma tu look completo." },
    { icon: MessageCircle, title: "Confirma por WhatsApp", text: "Tu pedido nos llega listo por WhatsApp. Sin registros ni formularios largos." },
    { icon: Truck, title: "Recibe gratis", text: "Te lo llevamos a cualquier barrio de Armenia. Pagas al recibir." },
  ];
  return (
    <section className="border-t border-line bg-coal py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.h2 {...reveal} className="text-center font-[family-name:var(--font-display)] text-5xl sm:text-6xl">
          Comprar es <span className="text-gold-gradient italic">así de fácil</span>
        </motion.h2>
        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div aria-hidden className="absolute top-10 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div key={s.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }} className="relative text-center">
              <div className="relative mx-auto grid size-20 place-items-center rounded-full border border-gold/40 bg-ink">
                <s.icon className="size-7 text-gold" />
                <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-ink">{i + 1}</span>
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-3xl">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm text-muted">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Final CTA -------------------------------- */

export function FinalCta() {
  const phone = useAppStore((s) => s.settings.whatsapp);
  return (
    <section className="relative overflow-hidden px-4 py-28 text-center sm:py-36">
      <div aria-hidden className="absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <motion.div {...reveal} className="relative mx-auto max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] leading-[0.95]">
          Tu próximo aroma
          <br />
          <span className="text-gold-gradient italic">te está esperando</span>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/catalog" className="btn-gold px-8 py-4">Comprar ahora</Link>
          <a href={waLink(phone, "Hola Alfa Capital 👋 Quiero asesoría")} target="_blank" rel="noopener noreferrer" className="btn-ghost px-8 py-4">
            <MessageCircle className="size-4" /> Asesoría por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
