"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCartStore } from "@/store/cart-store";
import { ProductMedia } from "@/components/product-media";
import { EditionBadge } from "./edition-badge";
import { FAMILY_LABEL } from "@/lib/labels";
import { cn, formatPrice } from "@/lib/format";
import type { Edition, Gender, Occasion, Product, ScentFamily } from "@/lib/types";

interface Answers {
  gender?: Gender;
  families?: ScentFamily[];
  occasions?: Occasion[];
  edition?: Edition | "any";
}

const QUESTIONS = [
  {
    key: "gender",
    title: "¿Para quién es?",
    options: [
      { label: "Para mí", sub: "Estilo femenino", emoji: "💄", value: { gender: "women" } },
      { label: "Para mí", sub: "Estilo masculino", emoji: "🕶️", value: { gender: "men" } },
      { label: "Un regalo", sub: "Para ella", emoji: "🎁", value: { gender: "women" } },
      { label: "Un regalo", sub: "Para él", emoji: "🎁", value: { gender: "men" } },
    ],
  },
  {
    key: "families",
    title: "¿Qué aroma te atrae más?",
    options: [
      { label: "Dulce", sub: "Vainilla, caramelo, frutos", emoji: "🍯", value: { families: ["sweet"] } },
      { label: "Fresco", sub: "Limpio, cítrico, marino", emoji: "🌊", value: { families: ["fresh", "citrus"] } },
      { label: "Amaderado", sub: "Elegante y seguro", emoji: "🪵", value: { families: ["woody"] } },
      { label: "Floral", sub: "Romántico y suave", emoji: "🌹", value: { families: ["floral"] } },
      { label: "Intenso", sub: "Oriental, oud, especias", emoji: "🔥", value: { families: ["oriental"] } },
    ],
  },
  {
    key: "occasions",
    title: "¿Cuándo lo usarás más?",
    options: [
      { label: "Día a día", sub: "Universidad, oficina", emoji: "☀️", value: { occasions: ["day", "office"] } },
      { label: "Noche", sub: "Rumba y planes", emoji: "🌙", value: { occasions: ["night", "party"] } },
      { label: "Citas", sub: "Para dejar huella", emoji: "💫", value: { occasions: ["date", "night"] } },
      { label: "Siempre", sub: "Un aroma de firma", emoji: "✨", value: { occasions: ["day", "night", "office", "date"] } },
    ],
  },
  {
    key: "edition",
    title: "¿Qué prefieres?",
    options: [
      { label: "Original", sub: "La experiencia completa", emoji: "👑", value: { edition: "original" } },
      { label: "Inspiración 1.1", sub: "Calidad a gran precio", emoji: "💎", value: { edition: "inspiration" } },
      { label: "Me da igual", sub: "Lo que mejor me quede", emoji: "🤝", value: { edition: "any" } },
    ],
  },
] as const;

function score(p: Product, a: Answers) {
  let s = 0;
  const max = 3 + 4 + 4 + 2;
  if (a.gender) s += p.gender === a.gender ? 3 : p.gender === "unisex" ? 2 : -4;
  if (a.families && p.family) s += a.families[0] === p.family ? 4 : a.families.includes(p.family) ? 3 : 0;
  if (a.occasions && p.occasions) s += Math.min(4, p.occasions.filter((o) => a.occasions!.includes(o)).length * 2);
  if (a.edition && a.edition !== "any") s += p.edition === a.edition ? 2 : 0;
  else s += 2;
  return { s, pct: Math.max(55, Math.min(99, Math.round((s / max) * 100))) };
}

export function ScentQuiz() {
  const products = useAppStore((s) => s.products);
  const add = useCartStore((s) => s.add);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= QUESTIONS.length;

  const results = useMemo(() => {
    if (!done) return [];
    return products
      .filter((p) => p.active && p.category === "perfumes" && p.stock > 0)
      .map((p) => ({ p, ...score(p, answers) }))
      .sort((x, y) => y.s - x.s)
      .slice(0, 3);
  }, [done, products, answers]);

  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  return (
    <div className="relative mx-auto min-h-[80svh] max-w-5xl px-4 pt-10 pb-24 sm:px-6 sm:pt-16">
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative text-center">
        <p className="eyebrow flex items-center justify-center gap-2"><Sparkles className="size-3.5" /> Asesor de aromas</p>
        {!done && (
          <div className="mx-auto mt-6 flex max-w-xs gap-2" aria-label={`Pregunta ${step + 1} de ${QUESTIONS.length}`}>
            {QUESTIONS.map((_, i) => (
              <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                <motion.span className="block h-full bg-gold" initial={false} animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }} />
              </span>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="relative mt-10"
          >
            <h1 className="text-center font-[family-name:var(--font-display)] text-4xl sm:text-6xl">{q.title}</h1>
            <div className={cn("mx-auto mt-12 grid gap-4", q.options.length === 4 ? "max-w-3xl sm:grid-cols-2" : "max-w-4xl sm:grid-cols-3")}>
              {q.options.map((o, i) => (
                <motion.button
                  key={`${o.label}-${o.sub}`}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, ...(o.value as Answers) }));
                    setStep((s) => s + 1);
                  }}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 text-left transition hover:border-gold/60 hover:bg-raised"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ink text-2xl">{o.emoji}</span>
                  <span>
                    <span className="block font-[family-name:var(--font-display)] text-2xl group-hover:text-gold-bright">{o.label}</span>
                    <span className="block text-sm text-muted">{o.sub}</span>
                  </span>
                </motion.button>
              ))}
            </div>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="mx-auto mt-10 flex items-center gap-2 text-sm text-muted hover:text-cream">
                <ArrowLeft className="size-4" /> Anterior
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative mt-8">
            <h1 className="text-center font-[family-name:var(--font-display)] text-4xl sm:text-6xl">
              Tus aromas <span className="text-gold-gradient italic">ideales</span>
            </h1>
            <p className="mt-4 text-center text-muted">Seleccionados según tu estilo. Cualquiera de estos te va a encantar.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {results.map(({ p, pct }, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40, rotateY: -20 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 0.15 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative flex flex-col rounded-3xl border bg-surface p-5",
                    i === 0 ? "border-gold/60 shadow-[0_0_80px_-20px_rgba(212,175,106,0.45)]" : "border-line",
                  )}
                >
                  {i === 0 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-bold tracking-widest text-ink uppercase">
                      Tu match perfecto
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <EditionBadge edition={p.edition} />
                    <span className="font-[family-name:var(--font-display)] text-2xl text-gold-bright">{pct}%</span>
                  </div>
                  <Link href={`/product/${p.slug}`} className="mx-auto mt-2 block aspect-square w-4/5">
                    <ProductMedia product={p} />
                  </Link>
                  <p className="text-xs tracking-[0.2em] text-muted uppercase">{p.house} · {p.family && FAMILY_LABEL[p.family]}</p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl">{p.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{p.description}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="font-semibold text-gold-bright">{formatPrice(p.price)}</span>
                    <button type="button" onClick={() => add(p.id)} className="btn-gold px-5 py-2.5">Agregar</button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 flex justify-center gap-3">
              <button type="button" onClick={() => { setAnswers({}); setStep(0); }} className="btn-ghost">
                <RotateCcw className="size-4" /> Repetir test
              </button>
              <Link href="/catalog?category=perfumes" className="btn-ghost">Ver todos los perfumes</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
