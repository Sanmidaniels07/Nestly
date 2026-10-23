import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NotFoundError, jsonLd, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { Paginated } from "@/src/types/api";
import { Product } from "@/src/types/product";
import { Store } from "@/src/types/store";
import SellerStorePage from "./store-page";

interface Props {
  params: Promise<{ id: string }>;
}

const clip = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
};

// One fetch per request - Next dedupes it between metadata and the page.
const loadStore = async (slug: string) => {
  try {
    return await serverGet<Store>(`/stores/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params;
  const response = await loadStore(slug);
  if (!response) return { title: "Store" };

  const store = response.data;
  // "Lagos" rather than "Lagos, Lagos".
  const where = [...new Set([store.city, store.state].filter(Boolean))].join(", ");
  const title = where ? `${store.name} – ${where}` : store.name;
  const description = clip(
    store.description
      ? `${store.description} Shop ${store.name} on ${SITE_NAME}.`
      : `Shop ${store.name}${where ? ` in ${where}` : ""} on ${SITE_NAME} - secure Paystack checkout and delivery-code protection.`,
    160
  );
  const image = store.banner || store.logo;
  const url = `/marketplace/seller/${store.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Without a store photo, share cards fall back to the Nestly image.
    openGraph: { title, description, url, type: "website", images: image ? [{ url: image, alt: store.name }] : [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [OG_IMAGE.url] },
  };
}

// schema.org Store so search engines know what and where it is.
const storeJsonLd = (store: Store) => ({
  "@context": "https://schema.org",
  "@type": "Store",
  name: store.name,
  url: `${SITE_URL}/marketplace/seller/${store.slug}`,
  description: store.description ? clip(store.description, 5000) : undefined,
  image: store.banner || store.logo || undefined,
  logo: store.logo || undefined,
  address:
    store.city || store.state
      ? { "@type": "PostalAddress", addressLocality: store.city || undefined, addressRegion: store.state || undefined, addressCountry: "NG" }
      : undefined,
  aggregateRating:
    store.rating && store.reviewCount
      ? { "@type": "AggregateRating", ratingValue: Math.round(store.rating * 10) / 10, reviewCount: store.reviewCount }
      : undefined,
});

export default async function StorePage({ params }: Props) {
  const { id: slug } = await params;
  const response = await loadStore(slug);
  const products = response
    ? await serverGet<Paginated<"products", Product>>(`/stores/${encodeURIComponent(slug)}/products?limit=12`).catch(() => null)
    : null;

  return (
    <>
      {response && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(storeJsonLd(response.data)) }} />}
      <SellerStorePage slug={slug} initialStore={response ?? undefined} initialProducts={products ?? undefined} />
    </>
  );
}
