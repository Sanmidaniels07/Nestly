import type { Metadata } from "next";

import { NotFoundError, jsonLd, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { stateLabel, stateSlug } from "@/src/lib/locations";
import { ProductDelivery, summarizeDelivery } from "@/src/lib/product-delivery";
import { Product } from "@/src/types/product";
import { Review, ReviewSummary } from "@/src/types/review";
import { Store } from "@/src/types/store";
import ProductDetailsPage from "./product-page";

interface Props {
  params: Promise<{ id: string }>;
}

type ReviewsPage = ReviewSummary & { reviews: Review[]; total: number };

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

// Categories > Cakes & Pastries > Lagos > product - same trail as the page.
const breadcrumbJsonLd = (product: Product) => {
  const state = product.store?.state;
  const trail = [
    { name: "Categories", item: `${SITE_URL}/marketplace/categories` },
    ...(product.category
      ? [
          { name: product.category.name, item: `${SITE_URL}/marketplace/categories/${product.category.slug}` },
          ...(state ? [{ name: stateLabel(state), item: `${SITE_URL}/marketplace/categories/${product.category.slug}/${stateSlug(state)}` }] : []),
        ]
      : []),
    { name: product.title, item: `${SITE_URL}/marketplace/product/${product.id}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })),
  };
};

// Nestly's returns policy (damaged, faulty, wrong or not as described):
// 3 days, or 1 day (24 hours) for perishables.
const returnPolicyJsonLd = (perishable: boolean) => ({
  "@type": "MerchantReturnPolicy",
  applicableCountry: "NG",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: perishable ? 1 : RETURN_WINDOW_DAYS,
});

// One entry per state the seller delivers to (with that state's cheapest
// fee), plus "anywhere in Nigeria" for a flat rate.
const shippingJsonLd = (delivery: ProductDelivery | null) => {
  if (!delivery) return undefined;
  const details = [
    ...delivery.regions.map((region) => ({
      fee: region.minFee,
      destination: { "@type": "DefinedRegion", addressCountry: "NG", ...(region.state ? { addressRegion: stateLabel(region.state) } : {}) },
    })),
    ...(delivery.flatRate ? [{ fee: delivery.flatRate.fee, destination: { "@type": "DefinedRegion", addressCountry: "NG" } }] : []),
  ].slice(0, 10);
  if (!details.length) return undefined;
  return details.map(({ fee, destination }) => ({
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: fee, currency: "NGN" },
    shippingDestination: destination,
  }));
};

// schema.org Product so Google can show price, stock, rating, delivery and
// returns in results.
const productJsonLd = (product: Product, reviews: ReviewsPage | null, delivery: ProductDelivery | null) => {
  const url = `${SITE_URL}/marketplace/product/${product.id}`;
  const active = (product.variations ?? []).filter((v) => v.isActive);
  const prices = active.length ? active.map((v) => v.price ?? product.price) : [product.price];
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const availability = product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const seller = product.store ? { "@type": "Organization", name: product.store.name, url: `${SITE_URL}/marketplace/seller/${product.store.slug}` } : undefined;
  const offerExtras = { shippingDetails: shippingJsonLd(delivery), hasMerchantReturnPolicy: returnPolicyJsonLd(!!product.category?.isPerishable) };

  // Real buyers' reviews of this version of the product, as shown on the page.
  const shown = (reviews?.reviews ?? []).filter((r) => !r.earlierVersion && r.user?.name).slice(0, 5);

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
            ...offerExtras,
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
            ...offerExtras,
          },
    aggregateRating:
      reviews && reviews.ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: Math.round(reviews.averageRating * 10) / 10, reviewCount: reviews.ratingCount }
        : undefined,
    review: shown.length
      ? shown.map((r) => ({
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          author: { "@type": "Person", name: r.user!.name },
          datePublished: r.createdAt.slice(0, 10),
          ...(r.comment ? { reviewBody: clip(r.comment, 1000) } : {}),
        }))
      : undefined,
  };
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const { response } = await loadProduct(id);
  const product = response?.data;

  // Reviews and the store's delivery zones/policies - both optional: the page
  // still renders if either can't be fetched.
  const [reviews, store] = await Promise.all([
    product ? serverGet<ReviewsPage>(`/products/${encodeURIComponent(id)}/reviews?limit=5`).then((r) => r?.data ?? null).catch(() => null) : null,
    product?.store?.slug ? serverGet<Store>(`/stores/${encodeURIComponent(product.store.slug)}`).then((r) => r?.data ?? null).catch(() => null) : null,
  ]);
  const delivery = product && store ? summarizeDelivery(store, product) : null;

  return (
    <>
      {product && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productJsonLd(product, reviews, delivery)) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd(product)) }} />
        </>
      )}
      <ProductDetailsPage id={id} initialProduct={response ?? undefined} delivery={delivery} />
    </>
  );
}
