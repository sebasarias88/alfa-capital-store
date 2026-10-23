import type { Metadata } from "next";
import { SEED_PRODUCTS } from "@/data/products";
import { ProductDetail } from "@/components/store/product-detail";
import { SITE_URL } from "@/lib/config";

export function generateStaticParams() {
  return SEED_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = SEED_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} · Alfa Capital`,
      description: product.description,
      url: `/product/${product.slug}`,
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Alfa Capital" }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seed = SEED_PRODUCTS.find((p) => p.slug === slug);
  const jsonLd = seed && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: seed.name,
    description: seed.description,
    brand: { "@type": "Brand", name: seed.house },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: seed.price,
      availability: seed.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${seed.slug}`,
    },
  };
  return (
    <>
      <ProductDetail slug={slug} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
