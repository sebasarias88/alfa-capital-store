"use client";

import { useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";

const IN_APP = /Instagram|FBAN|FBAV|TikTok|musical_ly/i;
const subscribe = () => () => {};

/** Instagram / Facebook / TikTok in-app browsers can lose the cart — suggest opening in the real browser */
export function InAppBrowserNotice() {
  const inApp = useSyncExternalStore(subscribe, () => IN_APP.test(navigator.userAgent), () => false);
  const [dismissed, setDismissed] = useState(false);
  if (!inApp || dismissed) return null;
  return (
    <div className="fixed inset-x-3 bottom-24 z-40 flex items-start gap-3 rounded-2xl border border-gold/30 bg-raised/95 p-4 text-sm shadow-2xl backdrop-blur">
      <p className="text-cream/90">
        Para una mejor experiencia, abre esta página en tu navegador: toca <strong className="text-gold">⋯</strong> y elige{" "}
        <strong className="text-gold">“Abrir en el navegador”</strong>.
      </p>
      <button type="button" aria-label="Cerrar aviso" onClick={() => setDismissed(true)} className="shrink-0 text-muted">
        <X className="size-4" />
      </button>
    </div>
  );
}
