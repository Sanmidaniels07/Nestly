import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import ProductCard from "@/src/app/(protected)/marketplace/components/product-card";
import { jsonLd, serverGet } from "@/src/lib/server-api";
import { areaLabel, stateLabel } from "@/src/lib/locations";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { Paginated } from "@/src/types/api";
import { Catalogue } from "@/src/types/catalogue";
import { Product } from "@/src/types/product";
import { categoryPath } from "../../../categories/category-listing";
import { Breadcrumbs, FaqSection, SellerCards, areaFaq, areaPath, faqJsonLd, findAreaInIndex, loadAreaIndex, loadAreaSellers } from "../../area-parts";

interface Props {
  params: Promise<{ state: string; area: string }>;
}

// "Shop in Festac, Lagos": sellers based in or delivering to an area, what
// they sell there and their latest listings. Only areas with live listings
// have a page.
const resolve = async (params: Props["params"]) => {
  const { state, area } = await params;
  const index = await loadAreaIndex();
  const found = findAreaInIndex(index, state, area);
  if (!found) notFound();
  return { ...found, index: index! };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, area } = await resolve(params);
  const where = areaLabel(area.name, state);
  const title = `Shop in ${where} – local sellers and delivery`;
  const description = `${area.storeCount} ${area.storeCount === 1 ? "seller" : "sellers"} with ${area.productCount} listings for ${where} on ${SITE_NAME}. Order online with secure Paystack checkout, local delivery or pickup, and delivery-code protection.`;
  const url = areaPath(state, area.name);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

export default async function AreaPage({ params }: Props) {
  const { state, area, index } = await resolve(params);
  const where = areaLabel(area.name, state);

  const query = new URLSearchParams({ state, area: area.name, limit: "12", sort: "newest" });
  const [products, sellers, catalogue] = await Promise.all([
    serverGet<Paginated<"products", Product>>(`/products?${query}`)
      .catch(() => null)
      .then((r) => r?.data?.products ?? []),
    loadAreaSellers(state, area.name),
    serverGet<Catalogue>("/seo/catalogue", 900)
      .catch(() => null)
      .then((r) => r?.data),
  ]);

  const names = new Map((catalogue?.categories ?? []).map((c) => [c.slug, c]));
  const categories = area.categories.filter((c) => names.has(c.slug));
  const neighbours = (index.states.find((s) => s.name === state)?.areas ?? []).filter((a) => a.name !== area.name).slice(0, 24);

  const faq = areaFaq({ place: where, what: "products", sellers });
  const crumbs = [
    { name: "Shop by area", url: "/marketplace/locations" },
    { name: stateLabel(state), url: `/marketplace/locations#${encodeURIComponent(stateLabel(state))}` },
    { name: area.name, url: areaPath(state, area.name) },
  ];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: `${SITE_URL}${crumb.url}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Sellers serving ${where}`,
      numberOfItems: sellers?.sellers.length ?? 0,
      itemListElement: (sellers?.sellers ?? []).map((seller, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/marketplace/seller/${encodeURIComponent(seller.slug)}`,
        name: seller.name,
      })),
    },
    faqJsonLd(faq),
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-1 py-6 sm:px-3 lg:px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3">
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Shop local on {SITE_NAME}
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[34px] italic leading-tight text-ink sm:text-[44px]">Shop in {where}</h1>
        <p className="max-w-3xl text-[14.5px] leading-relaxed text-muted">
          {area.storeCount} {area.storeCount === 1 ? "seller is" : "sellers are"} based in or delivering to {area.name}, with {area.productCount}{" "}
          {area.productCount === 1 ? "listing" : "listings"}. Pay securely with Paystack, choose delivery or pickup, and confirm with your delivery code
          when your order arrives.
        </p>
      </header>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const category = names.get(c.slug)!;
            return (
              <Link
                key={c.slug}
                href={categoryPath(c.slug, state, area.name)}
                className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {category.name} <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">{c.productCount}</span>
              </Link>
            );
          })}
        </div>
      )}

      {sellers && <SellerCards sellers={sellers} title={`Sellers serving ${area.name}`} />}

      {products.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[15px] font-semibold text-ink">Latest in {area.name}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <FaqSection faq={faq} />

      {neighbours.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
            <MapPin size={15} className="text-violet-600 dark:text-violet-400" /> More areas in {stateLabel(state)}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {neighbours.map((a) => (
              <Link
                key={a.name}
                href={areaPath(state, a.name)}
                className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                {a.name} <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">{a.storeCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
