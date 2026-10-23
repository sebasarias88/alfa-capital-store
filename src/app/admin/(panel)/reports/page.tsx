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
        <ol className="divide-y divide-line">
          {r.top.map((t, i) => (
            <li key={t.productId} className="flex items-center gap-3 py-3 text-sm">
              <span className="w-5 shrink-0 text-faint">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate">{t.name}</span>
              <span className="shrink-0 text-xs text-muted">{t.units} und.</span>
              <span className="w-28 shrink-0 text-right font-semibold">{formatPrice(t.revenue)}</span>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
