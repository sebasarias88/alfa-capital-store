"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatPrice } from "@/lib/format";

const GOLD = "#d4af6a";
const GRID = "#2e2924";
const AXIS = "#6f675d";

interface TooltipPayload {
  active?: boolean;
  label?: string;
  payload?: { value: number; payload: { label: string; orders?: number } }[];
}

function ChartTooltip({ active, payload, money = true }: TooltipPayload & { money?: boolean }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-line bg-raised px-3 py-2 text-xs shadow-xl">
      <p className="text-muted">{p.payload.label}</p>
      <p className="mt-0.5 text-sm font-semibold text-cream">{money ? formatPrice(p.value) : p.value}</p>
      {money && p.payload.orders !== undefined && <p className="text-faint">{p.payload.orders} pedidos</p>}
    </div>
  );
}

export function SalesAreaChart({ data, height = 280 }: { data: { label: string; revenue: number; orders: number }[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Ventas por día">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `$${formatCompact(v)}`} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: GOLD, strokeOpacity: 0.4, strokeDasharray: "4 4" }} />
          <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#salesFill)" activeDot={{ r: 5, fill: GOLD, stroke: "#0a0908", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersBarChart({ data, height = 240 }: { data: { label: string; orders: number }[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Pedidos por día">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
          <Tooltip content={<ChartTooltip money={false} />} cursor={{ fill: "#ffffff", fillOpacity: 0.04 }} />
          <Bar dataKey="orders" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Horizontal bars in plain HTML — values are always labeled */
export function BarList({ data, money = true, unit }: { data: { key: string; label: string; value: number }[]; money?: boolean; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <ul className="space-y-4">
      {data.map((d) => (
        <li key={d.key} title={`${d.label}: ${money ? formatPrice(d.value) : d.value}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-cream">{d.label}</span>
            <span className="shrink-0 text-cream">
              {money ? formatPrice(d.value) : `${d.value}${unit ? ` ${unit}` : ""}`}
              <span className="ml-2 text-xs text-faint">{Math.round((d.value / total) * 100)}%</span>
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-raised">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold transition-[width] duration-700" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
