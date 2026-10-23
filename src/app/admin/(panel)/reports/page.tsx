"use client";

import { useMemo, useState } from "react";
import { Download, Package, Percent, ShoppingBag, TrendingUp } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { BarList, OrdersBarChart, SalesAreaChart } from "@/components/admin/charts";
import { Card, PageHeader, RangeTabs, StatCard } from "@/components/admin/ui";
import {
  byCategory,
  byChannel,
  byEdition,
  byNeighborhood,
  byPayment,
  dailySeries,
  delta,
  downloadFile,
  inRange,
  toCsv,
  topProducts,
  totals,
} from "@/lib/analytics";
import { formatPrice } from "@/lib/format";

const RANGES = [
  { value: 7, label: "7 días" },
  { value: 30, label: "30 días" },
  { value: 90, label: "90 días" },
];

export default function ReportsPage() {
  const orders = useAppStore((s) => s.orders);
  const [range, setRange] = useState(30);

  const r = useMemo(() => {
    const cur = inRange(orders, range);
    const prev = inRange(orders, range, range);
    const t = totals(cur);
    const p = totals(prev);
    return {
      t,
      growth: delta(t.revenue, p.revenue),
      cancelRate: cur.length ? Math.round((t.cancelled / cur.length) * 100) : 0,
      series: dailySeries(cur, range),
      categories: byCategory(cur),
      editions: byEdition(cur),
      payments: byPayment(cur),
      channels: byChannel(cur),
      hoods: byNeighborhood(cur),
      top: topProducts(cur, 10),
    };
  }, [orders, range]);

  const exportReport = () =>
    downloadFile(
      `reporte-ventas-${range}d.csv`,
      toCsv(r.series.map((d) => ({ Fecha: d.label, Pedidos: d.orders, Ventas: d.revenue }))),
    );

  return (
    <>
      <PageHeader title="Reportes" subtitle="Entiende qué vende, dónde y cómo">
        <RangeTabs value={range} onChange={setRange} options={RANGES} />
        <button type="button" onClick={exportReport} className="btn-ghost py-2"><Download className="size-4" /> Exportar</button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Ventas del periodo" value={formatPrice(r.t.revenue)} delta={r.growth} hint="crecimiento" icon={TrendingUp} />
        <StatCard label="Pedidos" value={String(r.t.orders)} icon={ShoppingBag} />
        <StatCard label="Unidades vendidas" value={String(r.t.units)} icon={Package} />
        <StatCard label="Tasa de cancelación" value={`${r.cancelRate}%`} icon={Percent} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Ingresos por día"><SalesAreaChart data={r.series} height={260} /></Card>
        <Card title="Pedidos por día"><OrdersBarChart data={r.series} height={260} /></Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Por categoría"><BarList data={r.categories} /></Card>
        <Card title="Original vs. Inspiración 1.1"><BarList data={r.editions} /></Card>
        <Card title="Por canal de venta"><BarList data={r.channels} /></Card>
        <Card title="Métodos de pago"><BarList data={r.payments} money={false} unit="pedidos" /></Card>
        <Card title="Barrios con más pedidos" className="xl:col-span-2"><BarList data={r.hoods} money={false} unit="pedidos" /></Card>
      </div>

      <Card title="Ranking de productos" className="mt-4">
        <div className="-mx-5 overflow-x-auto sm:-mx-6">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 pb-3 font-medium sm:px-6">#</th>
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 text-right font-medium">Unidades</th>
                <th className="px-5 pb-3 text-right font-medium sm:px-6">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {r.top.map((t, i) => (
                <tr key={t.productId}>
                  <td className="px-5 py-3 text-faint sm:px-6">{i + 1}</td>
                  <td className="py-3">{t.name}</td>
                  <td className="py-3 text-right">{t.units}</td>
                  <td className="px-5 py-3 text-right font-semibold sm:px-6">{formatPrice(t.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
