"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2, Truck, X } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useCartSummary } from "@/store/use-cart-summary";
import { ProductMedia } from "@/components/product-media";
import { formatPrice } from "@/lib/format";
import { EDITION_LABEL } from "@/lib/labels";

export function CartDrawer() {
  const open = useCartStore((s) => s.open);
  const setOpen = useCartStore((s) => s.setOpen);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const { items, subtotal, discount, total, count } = useCartSummary();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            className="fixed top-0 right-0 bottom-0 z-[80] flex w-full max-w-md flex-col border-l border-line bg-coal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl">Tu carrito</h2>
                <p className="text-xs text-muted">{count} {count === 1 ? "producto" : "productos"}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar carrito" className="grid size-11 place-items-center rounded-full hover:bg-raised">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid size-20 place-items-center rounded-full border border-gold/30 text-gold">
                  <ShoppingBag className="size-8" />
                </div>
                <p className="font-[family-name:var(--font-display)] text-2xl">Tu carrito está vacío</p>
                <p className="text-sm text-muted">Descubre tu próximo aroma favorito.</p>
                <Link href="/catalog" onClick={() => setOpen(false)} className="btn-gold mt-2">Ver catálogo</Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-gold/10 px-6 py-3 text-xs text-gold-bright">
                  <Truck className="size-4" /> Tu domicilio en Armenia es <strong>GRATIS</strong>
                </div>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map(({ product, qty, comboId }) => (
                    <motion.li layout key={`${product.id}-${comboId ?? "single"}`} className="flex gap-4 rounded-2xl border border-line/70 bg-surface p-3">
                      <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-raised p-1">
                        <ProductMedia product={product} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{product.name}</p>
                            <p className="text-xs text-muted">{EDITION_LABEL[product.edition]}</p>
                            {comboId && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-gold uppercase">
                                <Sparkles className="size-3" /> Combo look
                              </span>
                            )}
                          </div>
                          <button type="button" onClick={() => remove(product.id, comboId)} aria-label={`Quitar ${product.name}`} className="grid size-9 place-items-center rounded-full text-faint hover:bg-raised hover:text-danger">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line">
                            <button type="button" aria-label="Restar uno" onClick={() => setQty(product.id, qty - 1, comboId)} className="grid size-9 place-items-center text-muted hover:text-cream">
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm">{qty}</span>
                            <button type="button" aria-label="Sumar uno" onClick={() => setQty(product.id, qty + 1, comboId)} className="grid size-9 place-items-center text-muted hover:text-cream">
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-gold-bright">{formatPrice(product.price * qty)}</p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="space-y-3 border-t border-line px-6 py-5">
                  <div className="flex justify-between text-sm text-muted"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success"><span>Descuento combo</span><span>-{formatPrice(discount)}</span></div>
                  )}
                  <div className="flex justify-between text-sm text-muted"><span>Domicilio</span><span className="text-success">Gratis</span></div>
                  <div className="flex items-end justify-between pt-2">
                    <span className="text-sm">Total</span>
                    <span className="font-[family-name:var(--font-display)] text-3xl text-gold-bright">{formatPrice(total)}</span>
                  </div>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn-gold w-full py-4">
                    Finalizar pedido
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
