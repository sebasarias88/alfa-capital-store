"use client";

import { useSyncExternalStore } from "react";

/**
 * How scroll-linked effects should run:
 * - "css": the browser supports scroll-driven animations → CSS handles them (smooth on phones)
 * - "js":  no support but a mouse/desktop device → Motion handles them
 * - "off": no support on a touch device → skip continuous scroll effects (avoids jank)
 */
export type ScrollMode = "css" | "js" | "off";

const subscribe = () => () => {};

function getMode(): ScrollMode {
  if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")) return "css";
  return window.matchMedia("(pointer: fine)").matches ? "js" : "off";
}

export function useScrollMode(): ScrollMode {
  return useSyncExternalStore(subscribe, getMode, () => "css");
}
