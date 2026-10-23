"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Download, MapPin, MessageCircle, Phone, Search, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Card, PageHeader, StatusBadge } from "./ui";
import { CHANNEL_LABEL, EDITION_LABEL, PAYMENT_LABEL, STATUS_LABEL } from "@/lib/labels";
import { cn, formatDateTime, formatPrice } from "@/lib/format";
import { downloadFile, toCsv } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";
import type { Order, OrderStatus } from "@/lib/types";

const FLOW: OrderStatus[] = ["new", "confirmed", "shipping", "delivered"];
const TABS: ("all" | OrderStatus)[] = ["all", "new", "confirmed", "shipping", "delivered", "cancelled"];

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const setStatus = useAppStore((s) => s.setOrderStatus);
  const storeName = useAppStore((s) => s.settings.storeName);
  const step = FLOW.indexOf(order.status);
  const subtotal = order.items.reduce((s, it) => s + it.price * it.qty, 0);
  const statusMsg: Record<OrderStatus, string> = {
    new: `Hola ${order.customer.name.split(" ")[0]} 👋 Recibimos tu pedido ${order.id}.`,
    confirmed: `Hola ${order.customer.name.split(" ")[0]} 👋 Tu pedido ${order.id} está confirmado ✅ Te avisamos cuando salga.`,
    shipping: `Hola ${order.customer.name.split(" ")[0]} 🛵 Tu pedido ${order.id} va en camino.`,
    delivered: `Hola ${order.customer.name.split(" ")[0]} 💛 Gracias por comprar en ${storeName}. ¡Disfrútalo!`,
    cancelled: `Hola ${order.customer.name.split(" ")[0]}, tu pedido ${order.id} fue cancelado. Escríbenos si necesitas ayuda.`,
  };

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`Pedido ${order.id}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-line bg-coal"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
      >
        <div className="flex items-start justify-between border-b border-line p-5 sm:p-6">
          <div>
            <p className="text-xs text-faint">{formatDateTime(order.createdAt)} · {CHANNEL_LABEL[order.channel]}</p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl">Pedido {order.id}</h2>
            <div className="mt-2"><StatusBadge status={order.status} /></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-10 place-items-center rounded-full hover:bg-raised">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          {order.status !== "cancelled" && (
            <div>
              <p className="label">Estado del pedido</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FLOW.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(order.id, s)}
                    className={cn(
                      "rounded-xl border px-2 py-2.5 text-[11px] font-semibold transition",
                      i <= step ? "border-gold bg-gold/15 text-gold-bright" : "border-line text-muted hover:border-gold/40",
                    )}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-line p-4">
            <p className="font-semibold">{order.customer.name}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Phone className="size-4" /> {order.customer.phone}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted"><MapPin className="size-4" /> {order.customer.address}, {order.customer.neighborhood}</p>
            <a href={waLink(order.customer.phone, statusMsg[order.status])} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4 w-full py-2.5">
              <MessageCircle className="size-4 text-[#25d366]" /> Escribir al cliente
            </a>
          </div>

          <div>
            <p className="label">Productos</p>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {order.items.map((it) => (
                <li key={it.productId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p>{it.qty} × {it.name}</p>
                    <p className="text-xs text-faint">{EDITION_LABEL[it.edition]}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(it.price * it.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><dt>Descuento</dt><dd>-{formatPrice(order.discount)}</dd></div>}
              <div className="flex justify-between text-muted"><dt>Pago</dt><dd>{PAYMENT_LABEL[order.payment]}</dd></div>
              <div className="flex justify-between pt-2 text-base font-semibold"><dt>Total</dt><dd className="text-gold-bright">{formatPrice(order.total)}</dd></div>
            </dl>
            {order.notes && <p className="mt-4 rounded-xl bg-raised p-3 text-sm text-muted">📝 {order.notes}</p>}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-line p-4 sm:flex-row">
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <button type="button" onClick={() => setStatus(order.id, "cancelled")} className="btn-ghost flex-1 py-3 hover:border-danger hover:text-danger">
              Cancelar pedido
            </button>
          )}
          {step >= 0 && step < FLOW.length - 1 && (
            <button type="button" onClick={() => setStatus(order.id, FLOW[step + 1])} className="btn-gold flex-1 py-3">
              Marcar como {STATUS_LABEL[FLOW[step + 1]].toLowerCase()}
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}

export function OrdersView() {
  const params = useSearchParams();
  const orders = useAppStore((s) => s.orders);
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(params.get("id"));
  const [limit, setLimit] = useState(30);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (tab === "all" || o.status === tab) &&
        (!term || `${o.id} ${o.customer.name} ${o.customer.phone} ${o.customer.neighborhood}`.toLowerCase().includes(term)),
    );
  }, [orders, tab, q]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  const exportCsv = () =>
    downloadFile(
      `pedidos-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(
        list.map((o) => ({
          Pedido: o.id,
          Fecha: new Date(o.createdAt).toLocaleString("es-CO"),
          Cliente: o.customer.name,
          Telefono: o.customer.phone,
          Barrio: o.customer.neighborhood,
          Productos: o.items.map((it) => `${it.qty}x ${it.name}`).join(" | "),
          Pago: PAYMENT_LABEL[o.payment],
          Canal: CHANNEL_LABEL[o.channel],
          Estado: STATUS_LABEL[o.status],
          Total: o.total,
        })),
      ),
    );

  return (
    <>
      <PageHeader title="Pedidos" subtitle={`${orders.length} pedidos en total`}>
        <button type="button" onClick={exportCsv} className="btn-ghost py-2.5"><Download className="size-4" /> Exportar Excel</button>
      </PageHeader>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
              tab === t ? "border-gold bg-gold font-semibold text-ink" : "border-line text-muted hover:text-cream",
            )}
          >
            {t === "all" ? "Todos" : STATUS_LABEL[t]}
            <span className={cn("rounded-full px-1.5 text-[11px]", tab === t ? "bg-ink/15" : "bg-raised")}>{counts[t] ?? 0}</span>
          </button>
        ))}
      </div>

      <Card>
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por pedido, cliente, teléfono o barrio…" aria-label="Buscar pedidos" className="input pl-11" />
        </div>
        <ul className="space-y-2 md:hidden">
          {list.slice(0, limit).map((o) => (
            <li key={o.id}>
              <button type="button" onClick={() => setSelectedId(o.id)} className="w-full rounded-xl border border-line p-3 text-left active:bg-raised">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gold-bright">{o.id}</p>
                    <p className="truncate text-sm">{o.customer.name}</p>
                    <p className="text-xs text-faint">{o.customer.neighborhood} · {formatDateTime(o.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
                <p className="mt-2 truncate border-t border-line pt-2 text-xs text-muted">
                  {o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")} · {PAYMENT_LABEL[o.payment]}
                </p>
              </button>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="py-12 text-center text-sm text-muted md:hidden">No hay pedidos con estos filtros.</p>}
        <div className="relative -mx-5 hidden overflow-x-auto sm:-mx-6 md:block">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 pb-3 font-medium sm:px-6">Pedido</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Productos</th>
                <th className="pb-3 font-medium">Pago</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="px-5 pb-3 text-right font-medium sm:px-6">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.slice(0, limit).map((o) => (
                <tr key={o.id} onClick={() => setSelectedId(o.id)} className="cursor-pointer transition hover:bg-raised/40">
                  <td className="px-5 py-3.5 sm:px-6">
                    <button type="button" className="font-semibold text-gold-bright hover:underline">{o.id}</button>
                    <p className="text-xs text-faint">{formatDateTime(o.createdAt)}</p>
                  </td>
                  <td className="py-3.5">
                    <p>{o.customer.name}</p>
                    <p className="text-xs text-faint">{o.customer.neighborhood}</p>
                  </td>
                  <td className="max-w-[220px] py-3.5">
                    <p className="truncate text-muted">{o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}</p>
                  </td>
                  <td className="py-3.5 text-muted">{PAYMENT_LABEL[o.payment]}</td>
                  <td className="py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 text-right font-semibold sm:px-6">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="py-12 text-center text-sm text-muted">No hay pedidos con estos filtros.</p>}
        </div>
        {list.length > limit && (
          <button type="button" onClick={() => setLimit((l) => l + 30)} className="btn-ghost mx-auto mt-5 flex py-2.5">
            Cargar más ({list.length - limit})
          </button>
        )}
      </Card>

      <AnimatePresence>{selected && <OrderDrawer order={selected} onClose={() => setSelectedId(null)} />}</AnimatePresence>
    </>
  );
}
