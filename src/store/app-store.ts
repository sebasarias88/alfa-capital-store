"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "@/lib/config";
import { SEED_PRODUCTS } from "@/data/products";
import { generateSeedOrders } from "@/data/orders";
import type { Order, OrderStatus, Product, StoreSettings } from "@/lib/types";

interface AppState {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  isAdmin: boolean;
  seeded: boolean;
  ensureSeed: () => void;
  login: () => void;
  logout: () => void;
  upsertProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProduct: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  resetDemo: () => void;
}

const nextOrderId = (orders: Order[]) => {
  const max = orders.reduce((m, o) => Math.max(m, Number(o.id.replace("AC-", "")) || 0), 1000);
  return `AC-${max + 1}`;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      orders: [],
      settings: DEFAULT_SETTINGS,
      isAdmin: false,
      seeded: false,

      // Orders are generated on the client (relative to "today") the first time
      ensureSeed: () => {
        if (get().seeded) return;
        set({ orders: generateSeedOrders(get().products), seeded: true });
      },

      login: () => set({ isAdmin: true }),
      logout: () => set({ isAdmin: false }),

      upsertProduct: (product) =>
        set((s) => {
          const exists = s.products.some((p) => p.id === product.id);
          return {
            products: exists ? s.products.map((p) => (p.id === product.id ? product : p)) : [product, ...s.products],
          };
        }),

      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      toggleProduct: (id) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)) })),

      addOrder: (input) => {
        const order: Order = {
          ...input,
          id: nextOrderId(get().orders),
          createdAt: new Date().toISOString(),
          status: "new",
        };
        set((s) => ({
          orders: [order, ...s.orders],
          // Discount stock like a real store would
          products: s.products.map((p) => {
            const line = order.items.find((it) => it.productId === p.id);
            return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
          }),
        }));
        return order;
      },

      setOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),

      updateSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),

      resetDemo: () =>
        set({
          products: SEED_PRODUCTS,
          orders: generateSeedOrders(SEED_PRODUCTS),
          settings: DEFAULT_SETTINGS,
          seeded: true,
        }),
    }),
    {
      name: "alfa-capital-demo",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
