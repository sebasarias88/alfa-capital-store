import { CATEGORY_LABEL, CHANNEL_LABEL, EDITION_LABEL, PAYMENT_LABEL } from "./labels";
import type { Category, Order, OrderChannel, PaymentMethod } from "./types";

const DAY = 86_400_000;

export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const isSale = (o: Order) => o.status !== "cancelled";

export function inRange(orders: Order[], days: number, offsetDays = 0, now = new Date()) {
  const end = startOfDay(now).getTime() + DAY - offsetDays * DAY;
  const start = end - days * DAY;
  return orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= start && t < end;
  });
}

export function totals(orders: Order[]) {
  const sales = orders.filter(isSale);
  const revenue = sales.reduce((s, o) => s + o.total, 0);
  const units = sales.reduce((s, o) => s + o.items.reduce((u, it) => u + it.qty, 0), 0);
  return {
    revenue,
    orders: sales.length,
    cancelled: orders.length - sales.length,
    units,
    avgTicket: sales.length ? Math.round(revenue / sales.length) : 0,
  };
}

export const delta = (current: number, previous: number) =>
  previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

export function dailySeries(orders: Order[], days: number, now = new Date()) {
  const today = startOfDay(now).getTime();
  const buckets = Array.from({ length: days }, (_, i) => {
    const t = today - (days - 1 - i) * DAY;
    return { t, revenue: 0, orders: 0 };
  });
  for (const o of orders) {
    if (!isSale(o)) continue;
    const t = startOfDay(new Date(o.createdAt)).getTime();
    const b = buckets.find((x) => x.t === t);
    if (b) {
      b.revenue += o.total;
      b.orders += 1;
    }
  }
  const fmt = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });
  return buckets.map((b) => ({ ...b, label: fmt.format(new Date(b.t)) }));
}

export function byCategory(orders: Order[]) {
  const map = new Map<Category, number>();
  for (const o of orders.filter(isSale)) for (const it of o.items) map.set(it.category, (map.get(it.category) ?? 0) + it.price * it.qty);
  return (Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({ key: c, label: CATEGORY_LABEL[c], value: map.get(c) ?? 0 }));
}

export function byEdition(orders: Order[]) {
  const map = { original: 0, inspiration: 0 };
  for (const o of orders.filter(isSale)) for (const it of o.items) map[it.edition] += it.price * it.qty;
  return (["inspiration", "original"] as const).map((e) => ({ key: e, label: EDITION_LABEL[e], value: map[e] }));
}

export function byPayment(orders: Order[]) {
  const map = new Map<PaymentMethod, number>();
  for (const o of orders.filter(isSale)) map.set(o.payment, (map.get(o.payment) ?? 0) + 1);
  return (Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((p) => ({ key: p, label: PAYMENT_LABEL[p], value: map.get(p) ?? 0 }));
}

export function byChannel(orders: Order[]) {
  const map = new Map<OrderChannel, number>();
  for (const o of orders.filter(isSale)) map.set(o.channel, (map.get(o.channel) ?? 0) + o.total);
  return (Object.keys(CHANNEL_LABEL) as OrderChannel[]).map((c) => ({ key: c, label: CHANNEL_LABEL[c], value: map.get(c) ?? 0 }));
}

export function byNeighborhood(orders: Order[], limit = 6) {
  const map = new Map<string, number>();
  for (const o of orders.filter(isSale)) map.set(o.customer.neighborhood, (map.get(o.customer.neighborhood) ?? 0) + 1);
  return [...map.entries()]
    .map(([label, value]) => ({ key: label, label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function topProducts(orders: Order[], limit = 5) {
  const map = new Map<string, { productId: string; name: string; units: number; revenue: number }>();
  for (const o of orders.filter(isSale))
    for (const it of o.items) {
      const cur = map.get(it.productId) ?? { productId: it.productId, name: it.name, units: 0, revenue: 0 };
      cur.units += it.qty;
      cur.revenue += it.price * it.qty;
      map.set(it.productId, cur);
    }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export interface CustomerSummary {
  phone: string;
  name: string;
  neighborhood: string;
  orders: number;
  spent: number;
  lastOrder: string;
  firstOrder: string;
}

export function customers(orders: Order[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();
  for (const o of orders) {
    if (!isSale(o)) continue;
    const key = o.customer.phone.replace(/\D/g, "");
    const cur = map.get(key);
    if (cur) {
      cur.orders += 1;
      cur.spent += o.total;
      if (o.createdAt > cur.lastOrder) cur.lastOrder = o.createdAt;
      if (o.createdAt < cur.firstOrder) cur.firstOrder = o.createdAt;
    } else
      map.set(key, {
        phone: o.customer.phone,
        name: o.customer.name,
        neighborhood: o.customer.neighborhood,
        orders: 1,
        spent: o.total,
        lastOrder: o.createdAt,
        firstOrder: o.createdAt,
      });
  }
  return [...map.values()].sort((a, b) => b.spent - a.spent);
}

export function toCsv(rows: Record<string, string | number>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.map(esc).join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export function downloadFile(name: string, content: string, type = "text/csv;charset=utf-8") {
  const blob = new Blob(["﻿" + content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function newCustomersCount(orders: Order[], days: number, now = new Date()) {
  const since = now.getTime() - days * DAY;
  return customers(orders).filter((c) => new Date(c.firstOrder).getTime() >= since).length;
}
