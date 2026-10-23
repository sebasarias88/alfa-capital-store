"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ImagePlus, Trash2, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { ProductMedia } from "@/components/product-media";
import { Select } from "@/components/ui/select";
import { CATEGORY_LABEL, EDITION_LABEL, FAMILY_LABEL, GENDER_LABEL, OCCASION_LABEL } from "@/lib/labels";
import { cn } from "@/lib/format";
import { fileToWebp } from "@/lib/image";
import type { Category, Edition, Gender, Occasion, Product, ProductArt, ScentFamily } from "@/lib/types";

const DEFAULT_ART: Record<Category, ProductArt> = {
  perfumes: { kind: "bottle", shape: "flacon", liquid: "#8a6a3c", cap: "#0d0c0b", accent: "#d4af6a" },
  watches: { kind: "watch", shape: "classic", dial: "#111111", strap: "#1c1a18", accent: "#d4af6a" },
  sunglasses: { kind: "glasses", shape: "aviator", frame: "#d4af6a", lens: "#2a2420", accent: "#f0d9a0" },
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyProduct = (): Product => ({
  id: `p-${Date.now().toString(36)}`,
  slug: "",
  name: "",
  house: "",
  category: "perfumes",
  gender: "unisex",
  edition: "inspiration",
  price: 0,
  stock: 0,
  description: "",
  art: DEFAULT_ART.perfumes,
  featured: false,
  isNew: true,
  active: true,
  sizeMl: 100,
  family: "woody",
  notes: { top: [], heart: [], base: [] },
  longevity: 4,
  sillage: 3,
  occasions: [],
});

export function ProductEditor({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const upsert = useAppStore((s) => s.upsertProduct);
  const remove = useAppStore((s) => s.deleteProduct);
  const [draft, setDraft] = useState<Product>(() => product ?? emptyProduct());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !product;

  const set = <K extends keyof Product>(key: K, value: Product[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setNotes = (tier: "top" | "heart" | "base", value: string) =>
    setDraft((d) => ({
      ...d,
      notes: { ...(d.notes ?? { top: [], heart: [], base: [] }), [tier]: value.split(",").map((s) => s.trim()).filter(Boolean) },
    }));

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
    setUploading(true);
    setError("");
    try {
      set("image", await fileToWebp(file));
    } catch {
      setError("No se pudo procesar la imagen");
    } finally {
      setUploading(false);
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) return setError("Escribe el nombre del producto");
    if (draft.price <= 0) return setError("El precio debe ser mayor a cero");
    try {
      upsert({ ...draft, slug: draft.slug || slugify(draft.name), compareAt: draft.compareAt || undefined });
      onClose();
    } catch {
      setError("No hay espacio para guardar más fotos en este navegador (modo demo).");
    }
  };

  const isPerfume = draft.category === "perfumes";

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? "Nuevo producto" : `Editar ${product.name}`}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[94dvh] overflow-y-auto rounded-t-3xl border border-line bg-coal sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(920px,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
      >
        <form onSubmit={save}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-coal/95 px-6 py-4 backdrop-blur">
            <h2 className="font-[family-name:var(--font-display)] text-3xl">{isNew ? "Nuevo producto" : "Editar producto"}</h2>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-10 place-items-center rounded-full hover:bg-raised">
              <X className="size-5" />
            </button>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-[260px_1fr]">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-raised to-coal p-3">
                <ProductMedia product={draft} />
                {uploading && <div className="absolute inset-0 grid place-items-center bg-ink/70 text-sm">Optimizando…</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost mt-3 w-full py-2.5">
                <ImagePlus className="size-4" /> {draft.image ? "Cambiar foto" : "Subir foto"}
              </button>
              {draft.image && (
                <button type="button" onClick={() => set("image", undefined)} className="mt-2 w-full text-xs text-muted hover:text-danger">
                  Quitar foto y usar ilustración
                </button>
              )}
              <p className="mt-3 text-xs text-faint">La foto se optimiza automáticamente a WebP antes de guardarse.</p>

              <div className="mt-6 space-y-3">
                {([
                  ["active", "Visible en la tienda"],
                  ["featured", "Destacado en inicio"],
                  ["isNew", "Marcar como nuevo"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-4 py-3 text-sm">
                    {label}
                    <input type="checkbox" checked={draft[key]} onChange={(e) => set(key, e.target.checked)} className="size-4 accent-[var(--color-gold)]" />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pe-name" className="label">Nombre</label>
                  <input id="pe-name" value={draft.name} onChange={(e) => set("name", e.target.value)} className="input" placeholder="Ej: Noir Absolu" />
                </div>
                <div>
                  <label htmlFor="pe-house" className="label">Marca / Casa</label>
                  <input id="pe-house" value={draft.house} onChange={(e) => set("house", e.target.value)} className="input" placeholder="Ej: Maison Aurum" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="pe-cat" className="label">Categoría</label>
                  <Select
                    id="pe-cat"
                    value={draft.category}
                    onChange={(v) => {
                      const c = v as Category;
                      setDraft((d) => ({ ...d, category: c, art: d.category === c ? d.art : DEFAULT_ART[c] }));
                    }}
                    options={(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))}
                  />
                </div>
                <div>
                  <label htmlFor="pe-gender" className="label">Para</label>
                  <Select id="pe-gender" value={draft.gender} onChange={(v) => set("gender", v as Gender)} options={(Object.keys(GENDER_LABEL) as Gender[]).map((g) => ({ value: g, label: GENDER_LABEL[g] }))} />
                </div>
                <div>
                  <label htmlFor="pe-ed" className="label">Tipo</label>
                  <Select id="pe-ed" value={draft.edition} onChange={(v) => set("edition", v as Edition)} options={(Object.keys(EDITION_LABEL) as Edition[]).map((ed) => ({ value: ed, label: EDITION_LABEL[ed] }))} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="pe-price" className="label">Precio (COP)</label>
                  <input id="pe-price" type="number" min={0} step={1000} value={draft.price || ""} onChange={(e) => set("price", Number(e.target.value))} className="input" />
                </div>
                <div>
                  <label htmlFor="pe-compare" className="label">Precio antes (opcional)</label>
                  <input id="pe-compare" type="number" min={0} step={1000} value={draft.compareAt ?? ""} onChange={(e) => set("compareAt", e.target.value ? Number(e.target.value) : undefined)} className="input" />
                </div>
                <div>
                  <label htmlFor="pe-stock" className="label">Stock</label>
                  <input id="pe-stock" type="number" min={0} value={draft.stock} onChange={(e) => set("stock", Number(e.target.value))} className="input" />
                </div>
              </div>

              <div>
                <label htmlFor="pe-desc" className="label">Descripción</label>
                <textarea id="pe-desc" rows={3} value={draft.description} onChange={(e) => set("description", e.target.value)} className="input resize-none" />
              </div>

              {isPerfume && (
                <div className="space-y-5 rounded-2xl border border-gold/20 bg-gold/[0.03] p-5">
                  <p className="eyebrow">Ficha olfativa</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="pe-ml" className="label">Tamaño (ml)</label>
                      <input id="pe-ml" type="number" min={0} value={draft.sizeMl ?? ""} onChange={(e) => set("sizeMl", Number(e.target.value) || undefined)} className="input" />
                    </div>
                    <div>
                      <label htmlFor="pe-family" className="label">Familia</label>
                      <Select id="pe-family" value={draft.family ?? "woody"} onChange={(v) => set("family", v as ScentFamily)} options={(Object.keys(FAMILY_LABEL) as ScentFamily[]).map((f) => ({ value: f, label: FAMILY_LABEL[f] }))} />
                    </div>
                  </div>
                  {(["top", "heart", "base"] as const).map((tier) => (
                    <div key={tier}>
                      <label htmlFor={`pe-${tier}`} className="label">
                        Notas de {tier === "top" ? "salida" : tier === "heart" ? "corazón" : "fondo"} <span className="text-faint">(separadas por coma)</span>
                      </label>
                      <input id={`pe-${tier}`} defaultValue={draft.notes?.[tier].join(", ")} onChange={(e) => setNotes(tier, e.target.value)} className="input" />
                    </div>
                  ))}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(["longevity", "sillage"] as const).map((key) => (
                      <div key={key}>
                        <label htmlFor={`pe-${key}`} className="label">
                          {key === "longevity" ? "Duración" : "Proyección"}: <span className="text-gold-bright">{draft[key]}/5</span>
                        </label>
                        <input id={`pe-${key}`} type="range" min={1} max={5} value={draft[key] ?? 3} onChange={(e) => set(key, Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="label">Ideal para</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(OCCASION_LABEL) as Occasion[]).map((o) => {
                        const on = draft.occasions?.includes(o);
                        return (
                          <button
                            key={o}
                            type="button"
                            aria-pressed={on}
                            onClick={() => set("occasions", on ? draft.occasions?.filter((x) => x !== o) : [...(draft.occasions ?? []), o])}
                            className={cn("rounded-full border px-3 py-1.5 text-xs transition", on ? "border-gold bg-gold text-ink" : "border-line text-muted")}
                          >
                            {OCCASION_LABEL[o]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {error && <p className="text-sm text-danger">{error}</p>}
            </div>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-line bg-coal/95 px-6 py-4 backdrop-blur">
            {!isNew ? (
              confirmDelete ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">¿Eliminar?</span>
                  <button type="button" onClick={() => { remove(draft.id); onClose(); }} className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white">Sí, eliminar</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="px-2 text-xs text-muted">No</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 text-sm text-muted hover:text-danger">
                  <Trash2 className="size-4" /> Eliminar
                </button>
              )
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-ghost py-2.5">Cancelar</button>
              <button type="submit" className="btn-gold py-2.5">{isNew ? "Crear producto" : "Guardar cambios"}</button>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
}
