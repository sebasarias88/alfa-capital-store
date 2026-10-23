"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, Save } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Card, PageHeader } from "@/components/admin/ui";
import type { StoreSettings } from "@/lib/types";

export default function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const update = useAppStore((s) => s.updateSettings);
  const reset = useAppStore((s) => s.resetDemo);
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [k]: v }));
  };

  return (
    <>
      <PageHeader title="Configuración" subtitle="Datos de la tienda y preferencias" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ ...draft, whatsapp: draft.whatsapp.replace(/\D/g, "") });
          setSaved(true);
        }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <Card title="Información de la tienda">
          <div className="space-y-4">
            <div>
              <label htmlFor="st-name" className="label">Nombre</label>
              <input id="st-name" value={draft.storeName} onChange={(e) => set("storeName", e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="st-city" className="label">Ciudad</label>
              <input id="st-city" value={draft.city} onChange={(e) => set("city", e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="st-wa" className="label">WhatsApp de pedidos (con indicativo 57)</label>
              <input id="st-wa" value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="input" inputMode="tel" />
            </div>
            <div>
              <label htmlFor="st-ig" className="label">Usuario de Instagram</label>
              <input id="st-ig" value={draft.instagram} onChange={(e) => set("instagram", e.target.value)} className="input" />
            </div>
          </div>
        </Card>
        <Card title="Ventas">
          <div className="space-y-4">
            <div>
              <label htmlFor="st-ann" className="label">Mensaje de la barra superior</label>
              <input id="st-ann" value={draft.announcement} onChange={(e) => set("announcement", e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="st-combo" className="label">Descuento “Arma tu look” (%)</label>
              <input id="st-combo" type="number" min={0} max={50} value={draft.comboDiscount} onChange={(e) => set("comboDiscount", Number(e.target.value))} className="input" />
            </div>
            <div>
              <label htmlFor="st-low" className="label">Alerta de stock bajo (unidades)</label>
              <input id="st-low" type="number" min={0} value={draft.lowStockThreshold} onChange={(e) => set("lowStockThreshold", Number(e.target.value))} className="input" />
            </div>
          </div>
        </Card>
        <div className="flex items-center gap-4 lg:col-span-2">
          <button type="submit" className="btn-gold"><Save className="size-4" /> Guardar cambios</button>
          {saved && <span className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="size-4" /> Guardado. Los cambios ya se ven en la tienda.</span>}
        </div>
      </form>

      <Card title="Modo demo" className="mt-8 border-dashed border-gold/30">
        <p className="text-sm text-muted">
          Esta es una versión de demostración: los datos se guardan solo en este navegador. Puedes restablecer productos, pedidos y configuración a su estado inicial.
        </p>
        {confirmReset ? (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span>¿Seguro?</span>
            <button
              type="button"
              onClick={() => {
                reset();
                setDraft(useAppStore.getState().settings);
                setConfirmReset(false);
              }}
              className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white"
            >
              Sí, restablecer
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="text-xs text-muted">Cancelar</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="btn-ghost mt-4 py-2.5"><RotateCcw className="size-4" /> Restablecer datos demo</button>
        )}
      </Card>
    </>
  );
}
