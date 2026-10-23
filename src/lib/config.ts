import type { StoreSettings } from "./types";

// Canonical URL: custom domain if set, otherwise Vercel's production URL (so WhatsApp previews work)
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Alfa Capital",
  // Business WhatsApp (from their Instagram / WhatsApp profile)
  whatsapp: "573215435140",
  instagram: "alfacapital.group",
  city: "Armenia, Quindío",
  announcement: "Domicilio GRATIS en toda Armenia · Pago contra entrega",
  comboDiscount: 10,
  lowStockThreshold: 5,
};

/** Demo-only credentials shown on the login screen */
export const DEMO_ADMIN = { email: "admin@alfacapital.co", password: "demo1234" };
