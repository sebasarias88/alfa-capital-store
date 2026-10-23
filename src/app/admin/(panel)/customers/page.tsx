"use client";

import { useMemo, useState } from "react";
import { Crown, Download, MessageCircle, Repeat, Search, Users } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Card, PageHeader, StatCard } from "@/components/admin/ui";
import { customers as summarize, downloadFile, toCsv } from "@/lib/analytics";
import { formatDate, formatPrice } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export default function CustomersPage() {
  const orders = useAppStore((s) => s.orders);
  const storeName = useAppStore((s) => s.settings.storeName);
  const [q, setQ] = useState("");
  const all = useMemo(() => summarize(orders), [orders]);
  const list = all.filter((c) => !q || `${c.name} ${c.phone} ${c.neighborhood}`.toLowerCase().includes(q.toLowerCase()));
  const repeat = all.filter((c) => c.orders > 1).length;
  const ltv = all.length ? Math.round(all.reduce((s, c) => s + c.spent, 0) / all.length) : 0;

  return (
    <>
      <PageHeader title="Clientes" subtitle="Tu base de clientes se construye sola con cada pedido">
        <button
          type="button"
          className="btn-ghost py-2.5"
          onClick={() =>
            downloadFile(
              "clientes.csv",
              toCsv(list.map((c) => ({ Nombre: c.name, Telefono: c.phone, Barrio: c.neighborhood, Pedidos: c.orders, Total: c.spent, Ultimo: formatDate(c.lastOrder) }))),
            )
          }
        >
          <Download className="size-4" /> Exportar
        </button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard label="Clientes" value={String(all.length)} icon={Users} />
        <StatCard label="Recompran" value={`${all.length ? Math.round((repeat / all.length) * 100) : 0}%`} hint={`${repeat} clientes`} icon={Repeat} />
        <div className="col-span-2 lg:col-span-1">
          <StatCard label="Valor promedio por cliente" value={formatPrice(ltv)} icon={Crown} />
        </div>
      </div>

      <Card className="mt-4">
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente…" aria-label="Buscar clientes" className="input pl-11" />
        </div>
        <ul className="space-y-2 md:hidden">
          {list.map((c, i) => (
            <li key={c.phone} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold-bright">
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{c.name}</span>
                  {i < 3 && !q && <Crown className="size-3.5 shrink-0 text-gold" aria-label="Top cliente" />}
                </p>
                <p className="truncate text-xs text-faint">{c.neighborhood} · {c.orders} {c.orders === 1 ? "pedido" : "pedidos"}</p>
                <p className="text-sm font-semibold text-gold-bright">{formatPrice(c.spent)}</p>
              </div>
              <a
                href={waLink(c.phone, `Hola ${c.name.split(" ")[0]} 👋 Te escribimos de ${storeName}. Tenemos novedades que te pueden encantar ✨`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir a ${c.name} por WhatsApp`}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-[#25d366]"
              >
                <MessageCircle className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <div className="relative -mx-5 hidden overflow-x-auto sm:-mx-6 md:block">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-faint">
                <th className="px-5 pb-3 font-medium sm:px-6">Cliente</th>
                <th className="pb-3 font-medium">Barrio</th>
                <th className="pb-3 font-medium">Pedidos</th>
                <th className="pb-3 font-medium">Último pedido</th>
                <th className="pb-3 text-right font-medium">Total comprado</th>
                <th className="px-5 pb-3 sm:px-6" aria-label="Acciones" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((c, i) => (
                <tr key={c.phone} className="transition hover:bg-raised/40">
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold-bright">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <div>
                        <p className="flex items-center gap-1.5">{c.name} {i < 3 && !q && <Crown className="size-3.5 text-gold" aria-label="Top cliente" />}</p>
                        <p className="text-xs text-faint">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted">{c.neighborhood}</td>
                  <td className="py-3">{c.orders}</td>
                  <td className="py-3 text-muted">{formatDate(c.lastOrder)}</td>
                  <td className="py-3 text-right font-semibold">{formatPrice(c.spent)}</td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    <a
                      href={waLink(c.phone, `Hola ${c.name.split(" ")[0]} 👋 Te escribimos de ${storeName}. Tenemos novedades que te pueden encantar ✨`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escribir a ${c.name} por WhatsApp`}
                      className="inline-grid size-9 place-items-center rounded-full border border-line text-[#25d366] hover:border-[#25d366]/50"
                    >
                      <MessageCircle className="size-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
