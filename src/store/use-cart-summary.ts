"use client";

import { useMemo } from "react";
import { useAppStore } from "./app-store";
import { useCartStore } from "./cart-store";
import type { Product } from "@/lib/types";

export interface CartItemView {
  product: Product;
  qty: number;
  comboId: string | undefined;
}

export function useCartSummary() {
  const lines = useCartStore((s) => s.lines);
  const products = useAppStore((s) => s.products);
  const comboDiscount = useAppStore((s) => s.settings.comboDiscount);

  return useMemo(() => {
    const items: CartItemView[] = lines
      .map((l) => {
        const product = products.find((p) => p.id === l.productId);
        return product ? { product, qty: l.qty, comboId: l.comboId } : null;
      })
      .filter((x): x is CartItemView => x !== null);

    const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
    const comboSubtotal = items.filter((it) => it.comboId).reduce((s, it) => s + it.product.price * it.qty, 0);
    const discount = Math.round((comboSubtotal * comboDiscount) / 100 / 100) * 100;
    const count = items.reduce((s, it) => s + it.qty, 0);

    return { items, subtotal, discount, total: subtotal - discount, count, comboDiscount };
  }, [lines, products, comboDiscount]);
}
