"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { ProductCard } from "./product-card";
import { Select } from "@/components/ui/select";
import { CATEGORY_LABEL, EDITION_LABEL, FAMILY_LABEL, GENDER_LABEL } from "@/lib/labels";
import { cn } from "@/lib/format";
import type { Category, Edition, Gender, ScentFamily } from "@/lib/types";

type Sort = "featured" | "price-asc" | "price-desc" | "new";

const SORT_LABEL: Record<Sort, string> = {
  featured: "Destacados",
  "price-asc": "Menor precio",
  "price-desc": "Mayor precio",
  new: "Novedades",
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm transition",
        active ? "border-gold bg-gold font-semibold text-ink" : "border-line text-muted hover:border-gold/50 hover:text-cream",
      )}
    >
      {children}
    </button>
  );
}

export function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const products = useAppStore((s) => s.products);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = (params.get("category") as Category | null) ?? null;
  const gender = (params.get("gender") as Gender | null) ?? null;
  const edition = (params.get("edition") as Edition | null) ?? null;
  const family = (params.get("family") as ScentFamily | null) ?? null;
  const sort = (params.get("sort") as Sort | null) ?? "featured";
  const q = params.get("q") ?? "";
  const [query, setQuery] = useState(q);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "category" && value !== "perfumes") next.delete("family");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.active &&
        (!category || p.category === category) &&
        (!gender || p.gender === gender || p.gender === "unisex") &&
        (!edition || p.edition === edition) &&
        (!family || p.family === family) &&
        (!term || `${p.name} ${p.house} ${p.description}`.toLowerCase().includes(term)),
    );
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "new") return Number(b.isNew) - Number(a.isNew);
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, category, gender, edition, family, sort, q]);

  const activeCount = [gender, edition, family].filter(Boolean).length;
  const title = category ? CATEGORY_LABEL[category] : "Todo el catálogo";

  const filters = (
    <div className="space-y-7">
      <fieldset>
        <legend className="eyebrow mb-3">Para</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!gender} onClick={() => setParam("gender", null)}>Todos</Chip>
          {(["women", "men"] as Gender[]).map((g) => (
            <Chip key={g} active={gender === g} onClick={() => setParam("gender", g)}>{GENDER_LABEL[g]}</Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3">Tipo</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={!edition} onClick={() => setParam("edition", null)}>Todos</Chip>
          {(["original", "inspiration"] as Edition[]).map((e) => (
            <Chip key={e} active={edition === e} onClick={() => setParam("edition", e)}>{EDITION_LABEL[e]}</Chip>
          ))}
        </div>
      </fieldset>
      {(!category || category === "perfumes") && (
        <fieldset>
          <legend className="eyebrow mb-3">Familia olfativa</legend>
          <div className="flex flex-wrap gap-2">
            <Chip active={!family} onClick={() => setParam("family", null)}>Todas</Chip>
            {(Object.keys(FAMILY_LABEL) as ScentFamily[]).map((f) => (
              <Chip key={f} active={family === f} onClick={() => setParam("family", f)}>{FAMILY_LABEL[f]}</Chip>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Catálogo</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-7xl">{title}</h1>
      </div>

      <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Chip active={!category} onClick={() => setParam("category", null)}>Todo</Chip>
        {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <Chip key={c} active={category === c} onClick={() => setParam("category", c)}>{CATEGORY_LABEL[c]}</Chip>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setParam("q", query || null);
          }}
          className="relative flex-1"
        >
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setParam("q", query || null)}
            placeholder="Buscar perfume, reloj, marca…"
            aria-label="Buscar productos"
            className="input rounded-full pl-11"
          />
        </form>
        <div className="flex gap-3">
          <button type="button" onClick={() => setFiltersOpen(true)} className="btn-ghost flex-1 px-5 py-3 lg:hidden">
            <SlidersHorizontal className="size-4" /> Filtros {activeCount > 0 && <span className="rounded-full bg-gold px-1.5 text-xs text-ink">{activeCount}</span>}
          </button>
          <Select
            ariaLabel="Ordenar"
            value={sort}
            onChange={(v) => setParam("sort", v === "featured" ? null : v)}
            options={(Object.keys(SORT_LABEL) as Sort[]).map((s) => ({ value: s, label: SORT_LABEL[s] }))}
            className="flex-1 sm:w-48 sm:flex-none"
            buttonClassName="rounded-full"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-28">{filters}</div>
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted">{list.length} {list.length === 1 ? "producto" : "productos"}</p>
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line py-24 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl">Sin resultados</p>
              <p className="mt-2 text-sm text-muted">Prueba con otros filtros o escríbenos, seguro lo conseguimos.</p>
              <button type="button" onClick={() => router.replace(pathname)} className="btn-ghost mt-6">Limpiar filtros</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              className="fixed inset-x-0 bottom-0 z-[80] max-h-[85svh] overflow-y-auto rounded-t-3xl border-t border-line bg-coal p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-3xl">Filtros</h2>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros" className="grid size-11 place-items-center rounded-full hover:bg-raised">
                  <X className="size-5" />
                </button>
              </div>
              {filters}
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn-gold mt-8 w-full py-4">
                Ver {list.length} productos
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
