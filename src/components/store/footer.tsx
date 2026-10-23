"use client";

import Link from "next/link";
import { MapPin, MessageCircle, Truck } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons";
import { Logo } from "@/components/logo";
import { useAppStore } from "@/store/app-store";
import { waLink } from "@/lib/whatsapp";

export function Footer() {
  const settings = useAppStore((s) => s.settings);
  return (
    <footer className="grain border-t border-line bg-coal">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Perfumería original e inspiraciones 1.1, relojes y gafas para dama y caballero. Estilo que se nota, aroma que se recuerda.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={`https://www.instagram.com/${settings.instagram}/`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-11 place-items-center rounded-full border border-line text-cream/80 transition hover:border-gold hover:text-gold">
              <Instagram className="size-5" />
            </a>
            <a href={waLink(settings.whatsapp, "Hola Alfa Capital 👋")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full border border-line text-cream/80 transition hover:border-gold hover:text-gold">
              <MessageCircle className="size-5" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="eyebrow">Tienda</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li><Link className="hover:text-gold-bright" href="/catalog?category=perfumes">Perfumería</Link></li>
            <li><Link className="hover:text-gold-bright" href="/catalog?category=watches">Relojes</Link></li>
            <li><Link className="hover:text-gold-bright" href="/catalog?category=sunglasses">Gafas</Link></li>
            <li><Link className="hover:text-gold-bright" href="/look">Arma tu look</Link></li>
            <li><Link className="hover:text-gold-bright" href="/quiz">Encuentra tu aroma</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Contacto</h3>
          <ul className="mt-5 space-y-4 text-sm text-muted">
            <li className="flex gap-3"><MapPin className="size-4 shrink-0 text-gold" /> {settings.city}</li>
            <li className="flex gap-3"><Truck className="size-4 shrink-0 text-gold" /> Domicilio gratis en toda Armenia</li>
            <li className="flex gap-3"><Instagram className="size-4 shrink-0 text-gold" /> @{settings.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-faint sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Alfa Capital. Todos los derechos reservados.</p>
          <p>Demo · imágenes y productos de prueba</p>
        </div>
      </div>
    </footer>
  );
}
