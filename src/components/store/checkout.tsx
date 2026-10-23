"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, LayoutDashboard, MessageCircle, Truck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCartStore } from "@/store/cart-store";
import { useCartSummary } from "@/store/use-cart-summary";
import { useHydrated } from "@/components/store-hydrator";
import { ProductMedia } from "@/components/product-media";
import { Select } from "@/components/ui/select";
import { NEIGHBORHOODS, PAYMENT_LABEL } from "@/lib/labels";
import { cn, formatPrice } from "@/lib/format";
import { orderMessage, waLink } from "@/lib/whatsapp";
import type { Order, PaymentMethod } from "@/lib/types";

export function Checkout() {
  const hydrated = useHydrated();
  const { items, subtotal, discount, total } = useCartSummary();
  const settings = useAppStore((s) => s.settings);
  const addOrder = useAppStore((s) => s.addOrder);
  const clear = useCartStore((s) => s.clear);
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [neighborhood, setNeighborhood] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:py-32">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} className="mx-auto grid size-24 place-items-center rounded-full bg-gold/15 text-gold">
          <CheckCircle2 className="size-12" />
        </motion.div>
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl">¡Pedido recibido!</h1>
        <p className="mt-4 text-muted">
          Tu pedido <strong className="text-cream">{placed.id}</strong> se abrió en WhatsApp. Envía el mensaje y te confirmamos la entrega en minutos.
        </p>
        <div className="mt-10 flex flex-col gap-3">
          <a href={waLink(settings.whatsapp, orderMessage(placed, settings.storeName))} target="_blank" rel="noopener noreferrer" className="btn-gold py-4">
            <MessageCircle className="size-4" /> Abrir WhatsApp de nuevo
          </a>
          <Link href="/catalog" className="btn-ghost py-4">Seguir comprando</Link>
        </div>
        <div className="mt-12 rounded-2xl border border-dashed border-gold/30 p-5 text-left text-sm text-muted">
          <p className="flex items-center gap-2 font-semibold text-gold-bright"><LayoutDashboard className="size-4" /> Modo demo</p>
          <p className="mt-2">Este pedido ya aparece en el panel administrativo con estado “Nuevo”.</p>
          <Link href="/admin/orders" className="mt-3 inline-block text-gold underline underline-offset-4">Ver en el admin →</Link>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl">Tu carrito está vacío</h1>
        <Link href="/catalog" className="btn-gold mt-8">Ver catálogo</Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      neighborhood: String(form.get("neighborhood") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      notes: String(form.get("notes") ?? "").trim(),
    };
    const nextErrors: Record<string, string> = {};
    if (data.name.length < 3) nextErrors.name = "Escribe tu nombre";
    if (data.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Número de celular de 10 dígitos";
    if (!data.neighborhood) nextErrors.neighborhood = "Elige tu barrio";
    if (data.address.length < 5) nextErrors.address = "Escribe la dirección";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const order = addOrder({
      customer: { name: data.name, phone: data.phone, neighborhood: data.neighborhood, address: data.address },
      items: items.map(({ product, qty }) => ({
        productId: product.id,
        name: product.name,
        category: product.category,
        edition: product.edition,
        price: product.price,
        qty,
      })),
      discount,
      total,
      payment,
      channel: "web",
      notes: data.notes || undefined,
    });
    window.open(waLink(settings.whatsapp, orderMessage(order, settings.storeName)), "_blank", "noopener");
    clear();
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  const field = (name: string) => cn("input", errors[name] && "border-danger focus:border-danger");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6 sm:pt-16">
      <p className="eyebrow">Último paso</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl sm:text-6xl">Finalizar pedido</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <form id="checkout" onSubmit={onSubmit} noValidate className="space-y-8">
          <fieldset className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <legend className="sr-only">Tus datos</legend>
            <h2 className="font-[family-name:var(--font-display)] text-3xl">¿A dónde lo llevamos?</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="label">Nombre completo</label>
                <input id="name" name="name" autoComplete="name" className={field("name")} placeholder="Ej: Laura Gómez" />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label">Celular / WhatsApp</label>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field("phone")} placeholder="300 123 4567" />
                {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="neighborhood" className="label">Barrio</label>
<Select
                  id="neighborhood"
                  name="neighborhood"
                  value={neighborhood}
                  onChange={setNeighborhood}
                  invalid={!!errors.neighborhood}
                  options={[...NEIGHBORHOODS, "Otro"].map((n) => ({ value: n, label: n }))}
                />
                {errors.neighborhood && <p className="mt-1 text-xs text-danger">{errors.neighborhood}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">Dirección</label>
                <input id="address" name="address" autoComplete="street-address" className={field("address")} placeholder="Calle 21 # 14-35, apto 302" />
                {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">Notas (opcional)</label>
                <textarea id="notes" name="notes" rows={2} className="input resize-none" placeholder="Es un regalo, entregar después de las 5 pm…" />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <legend className="sr-only">Método de pago</legend>
            <h2 className="font-[family-name:var(--font-display)] text-3xl">¿Cómo quieres pagar?</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((m) => (
                <label key={m} className={cn("flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition", payment === m ? "border-gold bg-gold/10" : "border-line hover:border-gold/40")}>
                  <input type="radio" name="payment" value={m} checked={payment === m} onChange={() => setPayment(m)} className="accent-[var(--color-gold)]" />
                  <span className="text-sm font-medium">{PAYMENT_LABEL[m]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line bg-coal p-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl">Resumen</h2>
            <ul className="mt-5 space-y-4">
              {items.map(({ product, qty, comboId }) => (
                <li key={`${product.id}-${comboId ?? ""}`} className="flex items-center gap-3">
                  <div className="relative size-16 shrink-0 rounded-xl bg-raised p-1">
                    <ProductMedia product={product} />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">{qty}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{product.name}</p>
                    {comboId && <p className="text-[10px] tracking-wider text-gold uppercase">Combo look</p>}
                  </div>
                  <p className="text-sm">{formatPrice(product.price * qty)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-success"><span>Descuento combo</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-muted"><span className="flex items-center gap-1.5"><Truck className="size-4" /> Domicilio Armenia</span><span className="text-success">Gratis</span></div>
              <div className="flex items-end justify-between pt-3">
                <span>Total</span>
                <span className="font-[family-name:var(--font-display)] text-4xl text-gold-bright">{formatPrice(total)}</span>
              </div>
            </div>
            <button type="submit" form="checkout" className="btn-gold mt-6 w-full py-4">
              <MessageCircle className="size-4" /> Enviar pedido por WhatsApp
            </button>
            <p className="mt-3 text-center text-xs text-faint">Se abrirá WhatsApp con tu pedido listo para enviar.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
