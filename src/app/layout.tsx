import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./globals.css";
import { SITE_URL } from "@/lib/config";
import { StoreHydrator } from "@/components/store-hydrator";

const TITLE = "Alfa Capital · Perfumería, relojes y gafas en Armenia";
const DESCRIPTION =
  "Perfumes originales e inspiraciones 1.1, relojes y gafas para dama y caballero. Domicilio GRATIS en toda Armenia, Quindío. Pide por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Alfa Capital" },
  description: DESCRIPTION,
  applicationName: "Alfa Capital",
  keywords: [
    "perfumes Armenia",
    "perfumería Armenia Quindío",
    "perfumes 1.1",
    "perfumes originales",
    "relojes Armenia",
    "gafas de sol Armenia",
    "domicilio gratis Armenia",
    "Alfa Capital",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Alfa Capital",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
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
