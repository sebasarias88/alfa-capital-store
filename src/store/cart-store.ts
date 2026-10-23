"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  qty: number;
  /** Lines added together from "Arma tu look" share a comboId */
  comboId?: string;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (productId: string, qty?: number) => void;
  addCombo: (productIds: string[]) => void;
  setQty: (productId: string, qty: number, comboId?: string) => void;
  remove: (productId: string, comboId?: string) => void;
  clear: () => void;
}

const same = (l: CartLine, productId: string, comboId?: string) => l.productId === productId && l.comboId === comboId;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (productId, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => same(l, productId));
          return {
            open: true,
            lines: existing
              ? s.lines.map((l) => (same(l, productId) ? { ...l, qty: l.qty + qty } : l))
              : [...s.lines, { productId, qty }],
          };
        }),
      addCombo: (productIds) =>
        set((s) => {
          const comboId = `combo-${Date.now().toString(36)}`;
          return { open: true, lines: [...s.lines, ...productIds.map((productId) => ({ productId, qty: 1, comboId }))] };
        }),
      setQty: (productId, qty, comboId) =>
        set((s) => ({
          lines: s.lines.map((l) => (same(l, productId, comboId) ? { ...l, qty: Math.max(1, qty) } : l)),
        })),
      remove: (productId, comboId) =>
        set((s) => {
          const target = s.lines.find((l) => same(l, productId, comboId));
          // Removing one piece of a combo turns the rest into regular items
          return {
            lines: s.lines
              .filter((l) => !same(l, productId, comboId))
              .map((l) => (target?.comboId && l.comboId === target.comboId ? { ...l, comboId: undefined } : l)),
          };
        }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "alfa-capital-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true,
    },
  ),
);
