import type { StoreSettings } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
