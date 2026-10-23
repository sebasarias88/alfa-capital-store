"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, DollarSign, Receipt, ShoppingBag, Users } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { BarList, SalesAreaChart } from "@/components/admin/charts";
import { Card, PageHeader, RangeTabs, StatCard, StatusBadge } from "@/components/admin/ui";
import { ProductMedia } from "@/components/product-media";
import { byCategory, dailySeries, newCustomersCount, delta, inRange, topProducts, totals } from "@/lib/analytics";
import { formatDateTime, formatPrice } from "@/lib/format";

const RANGES = [
  { value: 7, label: "7 días" },
  { value: 30, label: "30 días" },
  { value: 90, label: "90 días" },
];

export default function DashboardPage() {
  const orders = useAppStore((s) => s.orders);
  const products = useAppStore((s) => s.products);
  const threshold = useAppStore((s) => s.settings.lowStockThreshold);
  const [range, setRange] = useState(30);

  const data = useMemo(() => {
    const current = inRange(orders, range);
    const previous = inRange(orders, range, range);
    const t = totals(current);
    const p = totals(previous);
    const newCustomers = newCustomersCount(orders, range);
    return {
      t,
      deltas: { revenue: delta(t.revenue, p.revenue), orders: delta(t.orders, p.orders), avg: delta(t.avgTicket, p.avgTicket) },
      series: dailySeries(current, range),
      categories: byCategory(current),
      top: topProducts(current, 5),
      newCustomers,
    };
  }, [orders, range]);

  const lowStock = products.filter((p) => p.active && p.stock <= threshold).sort((a, b) => a.stock - b.stock);
  const pending = orders.filter((o) => o.status === "new" || o.status === "confirmed" || o.status === "shipping");
  const greeting = new Date().getHours() < 12 ? "Buenos días" : new Date().getHours() < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <>
      <PageHeader title={`${greeting} 👋`} subtitle="Así va tu negocio">
        <RangeTabs value={range} onChange={setRange} options={RANGES} />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Ventas" value={formatPrice(data.t.revenue)} delta={data.deltas.revenue} hint="vs. periodo anterior" icon={DollarSign} />
        <StatCard label="Pedidos" value={String(data.t.orders)} delta={data.deltas.orders} hint={`${data.t.units} unidades`} icon={ShoppingBag} />
        <StatCard label="Ticket promedio" value={formatPrice(data.t.avgTicket)} delta={data.deltas.avg} icon={Receipt} />
        <StatCard label="Clientes nuevos" value={String(data.newCustomers)} hint={`últimos ${range} días`} icon={Users} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Ventas por día" className="xl:col-span-2">
          <SalesAreaChart data={data.series} />
        </Card>
        <Card title="Ventas por categoría">
          <BarList data={data.categories} />
          <div className="mt-6 rounded-xl bg-raised/60 p-4 text-xs text-muted">
            La perfumería representa la mayor parte de tus ingresos. Los combos “Arma tu look” ayudan a vender más relojes y gafas.
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          title="Pedidos por atender"
          className="xl:col-span-2"
          action={<Link href="/admin/orders" className="flex items-center gap-1 text-xs text-gold hover:text-gold-bright">Ver todos <ArrowRight className="size-3.5" /></Link>}
        >
          {pending.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Todo al día ✨</p>
          ) : (
            <div className="-mx-5 overflow-x-auto sm:-mx-6">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-faint">
                    <th className="px-5 pb-3 font-medium sm:px-6">Pedido</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Estado</th>
                    <th className="px-5 pb-3 text-right font-medium sm:px-6">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pending.slice(0, 6).map((o) => (
                    <tr key={o.id} className="transition hover:bg-raised/40">
                      <td className="px-5 py-3 sm:px-6">
                        <Link href={`/admin/orders?id=${o.id}`} className="font-semibold text-gold-bright hover:underline">{o.id}</Link>
                        <p className="text-xs text-faint">{formatDateTime(o.createdAt)}</p>
                      </td>
                      <td className="py-3">
                        <p>{o.customer.name}</p>
                        <p className="text-xs text-faint">{o.customer.neighborhood}</p>
                      </td>
                      <td className="py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 text-right font-semibold sm:px-6">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Lo más vendido">
          <ol className="space-y-3">
            {data.top.map((t, i) => {
              const product = products.find((p) => p.id === t.productId);
              return (
                <li key={t.productId} className="flex items-center gap-3">
                  <span className="w-4 text-xs text-faint">{i + 1}</span>
                  <div className="size-11 shrink-0 rounded-lg bg-raised p-0.5">{product && <ProductMedia product={product} />}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{t.name}</p>
                    <p className="text-xs text-faint">{t.units} unidades</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(t.revenue)}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      {lowStock.length > 0 && (
        <Card
          title="Stock bajo"
          className="mt-4"
          action={<Link href="/admin/products?filter=low" className="flex items-center gap-1 text-xs text-gold hover:text-gold-bright">Gestionar <ArrowRight className="size-3.5" /></Link>}
        >
          <div className="flex gap-3 overflow-x-auto pb-1">
            {lowStock.map((p) => (
              <div key={p.id} className="flex w-56 shrink-0 items-center gap-3 rounded-xl border border-line p-3">
                <div className="size-12 shrink-0 rounded-lg bg-raised p-0.5"><ProductMedia product={p} /></div>
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.name}</p>
                  <p className={`flex items-center gap-1 text-xs font-semibold ${p.stock === 0 ? "text-danger" : "text-warning"}`}>
                    <AlertTriangle className="size-3.5" /> {p.stock === 0 ? "Agotado" : `${p.stock} unidades`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
