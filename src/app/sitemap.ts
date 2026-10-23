import type { MetadataRoute } from "next";
import { SEED_PRODUCTS } from "@/data/products";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/catalog", "/quiz", "/look"].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p ? 0.8 : 1 }));
  const products = SEED_PRODUCTS.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 }));
  return [...pages, ...products];
}
