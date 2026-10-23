import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./globals.css";
import { SITE_URL } from "@/lib/config";
import { StoreHydrator } from "@/components/store-hydrator";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alfa Capital · Perfumería, relojes y gafas en Armenia",
    template: "%s · Alfa Capital",
  },
  description:
    "Perfumes originales e inspiraciones 1.1, relojes y gafas para dama y caballero. Domicilio GRATIS en toda Armenia, Quindío.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Alfa Capital",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Alfa Capital" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Alfa Capital",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    address: { "@type": "PostalAddress", addressLocality: "Armenia", addressRegion: "Quindío", addressCountry: "CO" },
    sameAs: ["https://www.instagram.com/alfacapital.group/"],
  };
  return (
    <html lang="es-CO">
      <body className="min-h-dvh">
        <StoreHydrator />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
