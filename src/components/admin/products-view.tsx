"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { AlertTriangle, Eye, EyeOff, Minus, Pencil, Plus, Search, Star } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Card, PageHeader } from "./ui";
import { ProductEditor } from "./product-editor";
import { ProductMedia } from "@/components/product-media";
import { EditionBadge } from "@/components/store/edition-badge";
import { CATEGORY_LABEL, GENDER_LABEL } from "@/lib/labels";
import { cn, formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

function StockStepper({ product, threshold }: { product: Product; threshold: number }) {
  const upsert = useAppStore((s) => s.upsertProduct);
  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label={`Restar stock de ${product.name}`} onClick={() => upsert({ ...product, stock: Math.max(0, product.stock - 1) })} className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-cream">
        <Minus className="size-3.5" />
      </button>
      <span className={cn("w-8 text-center text-sm font-semibold", product.stock === 0 ? "text-danger" : product.stock <= threshold ? "text-warning" : "")}>{product.stock}</span>
      <button type="button" aria-label={`Sumar stock de ${product.name}`} onClick={() => upsert({ ...product, stock: product.stock + 1 })} className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-cream">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

function VisibleSwitch({ product }: { product: Product }) {
  const toggle = useAppStore((s) => s.toggleProduct);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={product.active}
      aria-label={`${product.active ? "Ocultar" : "Mostrar"} ${product.name} en la tienda`}
      onClick={() => toggle(product.id)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition", product.active ? "bg-gold" : "bg-line")}
    >
      <span className={cn("absolute top-0.5 grid size-5 place-items-center rounded-full bg-ink transition-all", product.active ? "left-[22px]" : "left-0.5")}>
        {product.active ? <Eye className="size-3 text-gold" /> : <EyeOff className="size-3 text-faint" />}
      </span>
    </button>
  );
}

export function ProductsView() {
  const params = useSearchParams();
  const products = useAppStore((s) => s.products);
  const threshold = useAppStore((s) => s.settings.lowStockThreshold);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [lowOnly, setLowOnly] = useState(params.get("filter") === "low");
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!lowOnly || p.stock <= threshold) &&
        (!term || `${p.name} ${p.house}`.toLowerCase().includes(term)),
    );
  }, [products, q, category, lowOnly, threshold]);

  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <>
      <PageHeader title="Productos" subtitle={`${products.length} productos · inventario valorizado en ${formatPrice(inventoryValue)}`}>
        <button type="button" onClick={() => setEditing("new")} className="btn-gold py-2.5"><Plus className="size-4" /> Nuevo producto</button>
      </PageHeader>

      <Card>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto…" aria-label="Buscar productos" className="input pl-11" />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {(["all", "perfumes", "watches", "sunglasses"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn("shrink-0 rounded-full border px-4 py-2 text-sm transition", category === c ? "border-gold bg-gold font-semibold text-ink" : "border-line text-muted hover:text-cream")}
              >
                {c === "all" ? "Todos" : CATEGORY_LABEL[c]}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={lowOnly}
              onClick={() => setLowOnly((v) => !v)}
              className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition", lowOnly ? "border-warning bg-warning/15 text-warning" : "border-line text-muted hover:text-cream")}
            >
              <AlertTriangle className="size-3.5" /> Stock bajo
            </button>
          </div>
        </div>

        <ul className="space-y-2 md:hidden">
          {list.map((p) => (
            <li key={p.id} className={cn("rounded-xl border border-line p-3", !p.active && "opacity-60")}>
              <div className="flex gap-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-raised p-0.5"><ProductMedia product={p} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1.5 font-medium">
                      <span className="truncate">{p.name}</span>
                      {p.featured && <Star className="size-3.5 shrink-0 fill-gold text-gold" aria-label="Destacado" />}
                    </p>
                    <button type="button" onClick={() => setEditing(p)} aria-label={`Editar ${p.name}`} className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted hover:text-gold-bright">
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-faint">{CATEGORY_LABEL[p.category]} · {GENDER_LABEL[p.gender]}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <EditionBadge edition={p.edition} />
                    <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <div className="flex items-center gap-2 text-xs text-muted">Stock <StockStepper product={p} threshold={threshold} /></div>
                <div className="flex items-center gap-2 text-xs text-muted">Visible <VisibleSwitch product={p} /></div>
              </div>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="py-12 text-center text-sm text-muted md:hidden">No hay productos con estos filtros.</p>}
        <div className="relative -mx-5 hidden overflow-x-auto sm:-mx-6 md:block">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 pb-3 font-medium sm:px-6">Producto</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Precio</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Visible</th>
                <th className="px-5 pb-3 text-right font-medium sm:px-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((p) => (
                <tr key={p.id} className={cn("transition hover:bg-raised/40", !p.active && "opacity-50")}>
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-raised p-0.5"><ProductMedia product={p} /></div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-medium">
                          {p.name} {p.featured && <Star className="size-3.5 fill-gold text-gold" aria-label="Destacado" />}
                        </p>
                        <p className="text-xs text-faint">{CATEGORY_LABEL[p.category]} · {GENDER_LABEL[p.gender]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><EditionBadge edition={p.edition} /></td>
                  <td className="py-3">
                    <p className="font-semibold">{formatPrice(p.price)}</p>
                    {p.compareAt && <p className="text-xs text-faint line-through">{formatPrice(p.compareAt)}</p>}
                  </td>
                  <td className="py-3"><StockStepper product={p} threshold={threshold} /></td>
                  <td className="py-3"><VisibleSwitch product={p} /></td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    <button type="button" onClick={() => setEditing(p)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-gold/50 hover:text-gold-bright">
                      <Pencil className="size-3.5" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="py-12 text-center text-sm text-muted">No hay productos con estos filtros.</p>}
        </div>
      </Card>

      <AnimatePresence>{editing && <ProductEditor product={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}</AnimatePresence>
    </>
  );
}
