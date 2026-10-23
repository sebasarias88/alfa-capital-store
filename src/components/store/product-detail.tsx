"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Clock, MessageCircle, Minus, Plus, ShieldCheck, Truck, Wind } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCartStore } from "@/store/cart-store";
import { ProductMedia } from "@/components/product-media";
import { ProductCard } from "./product-card";
import { EditionBadge } from "./edition-badge";
import { CATEGORY_LABEL, FAMILY_LABEL, GENDER_LABEL, OCCASION_LABEL } from "@/lib/labels";
import { formatPrice } from "@/lib/format";
import { productQuestion, waLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

function Meter({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Clock }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted"><Icon className="size-4 text-gold" /> {label}</span>
        <span className="text-xs text-faint">{value}/5</span>
      </div>
      <div className="mt-2 flex gap-1.5" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={5} aria-valuenow={value}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < value ? "bg-gold" : "bg-line"}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{ originX: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

function Pyramid({ product }: { product: Product }) {
  if (!product.notes) return null;
  const tiers = [
    { label: "Salida", hint: "Los primeros minutos", notes: product.notes.top, width: "w-[55%]" },
    { label: "Corazón", hint: "De 30 min a 3 horas", notes: product.notes.heart, width: "w-[78%]" },
    { label: "Fondo", hint: "Lo que queda en tu piel", notes: product.notes.base, width: "w-full" },
  ];
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-3xl">Pirámide olfativa</h2>
      <div className="mt-6 flex flex-col items-center gap-2">
        {tiers.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className={`${t.width} rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/[0.04] via-gold/10 to-gold/[0.04] px-4 py-4 text-center`}
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">{t.label}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-xl">{t.notes.join(" · ")}</p>
            <p className="mt-0.5 text-[11px] text-faint">{t.hint}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProductDetail({ slug }: { slug: string }) {
  const products = useAppStore((s) => s.products);
  const phone = useAppStore((s) => s.settings.whatsapp);
  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl">Producto no encontrado</h1>
        <Link href="/catalog" className="btn-gold mt-8">Volver al catálogo</Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.active && p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6">
      <Link href={`/catalog?category=${product.category}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold-bright">
        <ArrowLeft className="size-4" /> {CATEGORY_LABEL[product.category]}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="grain relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-gradient-to-b from-raised to-coal"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,106,0.14),transparent_60%)]" />
            <motion.div
              className="absolute inset-[6%]"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ProductMedia product={product} />
            </motion.div>
            <div className="absolute top-5 left-5"><EditionBadge edition={product.edition} /></div>
          </motion.div>
        </div>

        <div>
          <p className="eyebrow">{product.house}</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-none sm:text-6xl">{product.name}</h1>
          <p className="mt-3 text-sm text-muted">
            {GENDER_LABEL[product.gender]}
            {product.sizeMl && ` · ${product.sizeMl} ml`}
            {product.family && ` · ${FAMILY_LABEL[product.family]}`}
          </p>

          <div className="mt-6 flex items-end gap-4">
            <p className="font-[family-name:var(--font-display)] text-4xl text-gold-bright">{formatPrice(product.price)}</p>
            {product.compareAt && <p className="pb-1 text-lg text-faint line-through">{formatPrice(product.compareAt)}</p>}
          </div>

          <p className="mt-6 leading-relaxed text-cream/80">{product.description}</p>

          {product.stock <= 0 ? (
            <p className="mt-6 text-sm font-semibold text-danger">Agotado por ahora</p>
          ) : lowStock ? (
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-warning">
              <span className="size-2 animate-pulse rounded-full bg-warning" /> ¡Solo quedan {product.stock} unidades!
            </p>
          ) : (
            <p className="mt-6 flex items-center gap-2 text-sm text-success">
              <span className="size-2 rounded-full bg-success" /> Disponible para entrega hoy
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center justify-between rounded-full border border-line sm:justify-start">
              <button type="button" aria-label="Restar uno" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center text-muted hover:text-cream">
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Sumar uno" onClick={() => setQty((q) => q + 1)} className="grid size-12 place-items-center text-muted hover:text-cream">
                <Plus className="size-4" />
              </button>
            </div>
            <button type="button" disabled={product.stock <= 0} onClick={() => add(product.id, qty)} className="btn-gold flex-1 py-4">
              Agregar al carrito
            </button>
          </div>
          <a href={waLink(phone, productQuestion(product.name))} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full py-4">
            <MessageCircle className="size-4 text-[#25d366]" /> Preguntar por WhatsApp
          </a>

          <ul className="mt-8 grid gap-3 rounded-2xl border border-line p-5 text-sm sm:grid-cols-2">
            <li className="flex items-center gap-3"><Truck className="size-5 text-gold" /> Domicilio gratis en Armenia</li>
            <li className="flex items-center gap-3"><ShieldCheck className="size-5 text-gold" /> Pago contra entrega</li>
          </ul>

          {product.category === "perfumes" && (
            <div className="mt-10 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {product.longevity && <Meter label="Duración" value={product.longevity} icon={Clock} />}
                {product.sillage && <Meter label="Proyección" value={product.sillage} icon={Wind} />}
              </div>
              {product.occasions && (
                <div>
                  <p className="eyebrow mb-3">Ideal para</p>
                  <div className="flex flex-wrap gap-2">
                    {product.occasions.map((o) => (
                      <span key={o} className="rounded-full border border-gold/30 px-4 py-1.5 text-sm text-gold-bright">{OCCASION_LABEL[o]}</span>
                    ))}
                  </div>
                </div>
              )}
              <Pyramid product={product} />
            </div>
          )}

          {product.specs && product.specs.length > 0 && (
            <div className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-[family-name:var(--font-display)] text-3xl">Detalles</h2>
              <dl className="mt-5 divide-y divide-line">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            También te puede <span className="text-gold-gradient italic">gustar</span>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
