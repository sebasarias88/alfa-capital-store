"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { useCartStore } from "@/store/cart-store";

/** Loads persisted demo data from localStorage after the first render (avoids SSR mismatches) */
export function StoreHydrator() {
  useEffect(() => {
    Promise.all([useAppStore.persist.rehydrate(), useCartStore.persist.rehydrate()]).then(() => {
      useAppStore.getState().ensureSeed();
    });
  }, []);
  return null;
}

export function useHydrated() {
  return useAppStore((s) => s.seeded);
}
