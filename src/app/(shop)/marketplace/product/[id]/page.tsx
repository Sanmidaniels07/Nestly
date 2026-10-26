import type { Metadata } from "next";

import { NotFoundError, jsonLd, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { Product } from "@/src/types/product";
import { ReviewSummary } from "@/src/types/review";
import ProductDetailsPage from "./product-page";

interface Props {
  params: Promise<{ id: string }>;
}

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const clip = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
};

// One fetch per request - Next dedupes it between metadata and the page.
// "hidden": the public API says not found - it may still be a product of a
// suspended store an admin can open, so the browser checks with their login.
const loadProduct = async (id: string) => {
  try {
    return { response: await serverGet<Product>(`/products/${encodeURIComponent(id)}`), hidden: false };
  } catch (error) {
    if (error instanceof NotFoundError) return { response: null, hidden: true };
    throw error;
  }
};

const coverOf = (product: Product) =>
  product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { response, hidden } = await loadProduct(id);
  // Not public (missing, or a suspended store only admins may open):
  // the browser retries with the viewer's login; never index it.
  if (hidden) return { title: "Product", robots: { index: false, follow: false } };
  if (!response) return { title: "Product" };

  const product = response.data;
  const where = [product.store?.name, product.store?.city].filter(Boolean).join(", ");
  const title = `${product.title} – ${naira(product.price)}`;
  const description = clip(
    `${product.description} ${where ? `Sold by ${where}.` : ""} Buy securely on ${SITE_NAME} with Paystack checkout and delivery-code protection.`,
    160
  );
  const cover = coverOf(product);
  const url = `/marketplace/product/${product.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: cover ? [{ url: cover, alt: product.title }] : [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: cover ? [cover] : [OG_IMAGE.url] },
  };
}

const CONDITION: Record<string, string> = {
  NEW: "https://schema.org/NewCondition",
  USED: "https://schema.org/UsedCondition",
  REFURBISHED: "https://schema.org/RefurbishedCondition",
};

// schema.org Product so Google can show price, stock and rating in results.
const productJsonLd = (product: Product, reviews: ReviewSummary | null) => {
  const url = `${SITE_URL}/marketplace/product/${product.id}`;
  const active = (product.variations ?? []).filter((v) => v.isActive);
  const prices = active.length ? active.map((v) => v.price ?? product.price) : [product.price];
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const availability = product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const seller = product.store ? { "@type": "Organization", name: product.store.name, url: `${SITE_URL}/marketplace/seller/${product.store.slug}` } : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: clip(product.description, 5000),
    image: product.images.map((image) => image.url),
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: product.category?.name,
    url,
    offers:
      low === high
        ? {
            "@type": "Offer",
            url,
            priceCurrency: "NGN",
            price: low,
            availability,
            itemCondition: CONDITION[product.condition],
            seller,
          }
        : {
            "@type": "AggregateOffer",
            url,
            priceCurrency: "NGN",
            lowPrice: low,
            highPrice: high,
            offerCount: active.length,
            availability,
            seller,
          },
    aggregateRating:
      reviews && reviews.ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: Math.round(reviews.averageRating * 10) / 10, reviewCount: reviews.ratingCount }
        : undefined,
  };
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const { response } = await loadProduct(id);
  const reviews = response ? await serverGet<ReviewSummary>(`/products/${encodeURIComponent(id)}/reviews?limit=1`).catch(() => null) : null;

  return (
    <>
      {response && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(productJsonLd(response.data, reviews?.data ?? null)) }}
        />
      )}
      <ProductDetailsPage id={id} initialProduct={response ?? undefined} />
    </>
  );
}
