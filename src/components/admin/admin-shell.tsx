"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChart3, ExternalLink, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingCart, Users, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useHydrated } from "@/components/store-hydrator";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/reports", label: "Reportes", icon: BarChart3 },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);
  const newOrders = useAppStore((s) => s.orders.filter((o) => o.status === "new").length);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <Image src="/logo.png" alt="" width={40} height={40} className="rounded-full ring-1 ring-gold/40" />
        <div className="leading-tight">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.15em]">ALFA CAPITAL</p>
          <p className="text-[10px] tracking-[0.3em] text-gold uppercase">Admin</p>
        </div>
      </div>
      <nav aria-label="Administración" className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active ? "bg-gold/10 font-semibold text-gold-bright" : "text-muted hover:bg-raised hover:text-cream",
              )}
            >
              {active && <motion.span layoutId="admin-nav" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold" />}
              <item.icon className="size-[18px]" />
              {item.label}
              {item.href === "/admin/orders" && newOrders > 0 && (
                <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">{newOrders}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-raised hover:text-cream">
          <ExternalLink className="size-[18px]" /> Ver tienda
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-raised hover:text-danger"
        >
          <LogOut className="size-[18px]" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const isAdmin = useAppStore((s) => s.isAdmin);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !isAdmin) router.replace("/admin/login");
  }, [hydrated, isAdmin, router]);

  if (!hydrated || !isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="size-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" aria-label="Cargando" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-coal lg:block">
        <Sidebar />
      </aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-coal lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute top-5 right-3 grid size-10 place-items-center rounded-full hover:bg-raised">
                <X className="size-5" />
              </button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-ink/80 px-4 backdrop-blur-xl lg:hidden">
          <button type="button" aria-label="Abrir menú" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-raised">
            <Menu className="size-5" />
          </button>
          <Image src="/logo.png" alt="" width={32} height={32} className="rounded-full" />
          <span className="font-[family-name:var(--font-display)] text-lg tracking-[0.15em]">ALFA CAPITAL</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
