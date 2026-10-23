"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { useCartSummary } from "@/store/use-cart-summary";
import { useCartStore } from "@/store/cart-store";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/catalog?category=perfumes", label: "Perfumería" },
  { href: "/catalog?category=watches", label: "Relojes" },
  { href: "/catalog?category=sunglasses", label: "Gafas" },
  { href: "/look", label: "Arma tu look" },
  { href: "/quiz", label: "Encuentra tu aroma" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCartSummary();
  const setOpen = useCartStore((s) => s.setOpen);
  const announcement = useAppStore((s) => s.settings.announcement);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="relative z-50 overflow-hidden border-b border-gold/15 bg-coal">
        <div className="flex w-max animate-marquee gap-12 py-2 text-[11px] font-medium tracking-[0.2em] text-gold-bright/90 uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap">
              {announcement}
              <span aria-hidden className="text-gold/50">✦</span>
            </span>
          ))}
        </div>
      </div>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled ? "border-b border-line/70 bg-ink/80 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:h-20 sm:px-6">
          <Logo />
          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-sm text-cream/80 transition hover:text-gold-bright"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/catalog" aria-label="Buscar productos" className="grid size-11 place-items-center rounded-full text-cream/80 transition hover:bg-raised hover:text-gold-bright">
              <Search className="size-5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Abrir carrito (${count} productos)`}
              className="relative grid size-11 place-items-center rounded-full text-cream/80 transition hover:bg-raised hover:text-gold-bright"
            >
              <ShoppingBag className="size-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="grid size-11 place-items-center rounded-full text-cream/80 transition hover:bg-raised lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="grid size-11 place-items-center rounded-full hover:bg-raised">
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Menú móvil" className="flex flex-col gap-1 px-6 pt-8">
              {[{ href: "/", label: "Inicio" }, { href: "/catalog", label: "Todo el catálogo" }, ...NAV].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-line/60 py-4 font-[family-name:var(--font-display)] text-3xl text-cream">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
