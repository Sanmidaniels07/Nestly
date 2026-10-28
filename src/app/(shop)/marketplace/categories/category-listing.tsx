import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KeyRound, MapPin, ShieldCheck, ShoppingBag, SlidersHorizontal } from "lucide-react";

import ProductCard from "@/src/app/(protected)/marketplace/components/product-card";
import { jsonLd, serverGet } from "@/src/lib/server-api";
import { areaLabel, areaSlug, stateFromSlug, stateLabel, stateSlug } from "@/src/lib/locations";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { Paginated } from "@/src/types/api";
import { AreaIndex } from "@/src/types/areas";
import { Catalogue, CatalogueCategory } from "@/src/types/catalogue";
import { Product } from "@/src/types/product";
import { Breadcrumbs, FaqSection, SellerCards, areaFaq, faqJsonLd, findAreaInIndex, loadAreaIndex, loadAreaSellers } from "../locations/area-parts";

// Public category pages: "Cakes & Pastries" across Nigeria, in one state
// ("Cakes & Pastries in Lagos") or in one area ("Cakes & Pastries in
// Festac, Lagos" - sellers based in or delivering to Festac). Rendered on
// the server so search engines see the listings, with links between
// states, areas and categories.

export const PAGE_SIZE = 24;

export const categoryPath = (slug: string, state?: string | null, area?: string | null) =>
  `/marketplace/categories/${slug}${state ? `/${stateSlug(state)}` : ""}${state && area ? `/${areaSlug(area)}` : ""}`;

interface Resolved {
  catalogue: Catalogue;
  category: CatalogueCategory;
  state: string | null;
  area: string | null;
  areas: AreaIndex | null;
}

// The catalogue, the category and (optionally) the state and area a URL
// points at. Unknown category, state or area -> 404; so is an area with no
// listings in the category.
export const resolveListing = async (slug: string, locationSlug?: string, areaParam?: string): Promise<Resolved> => {
  const [response, areas] = await Promise.all([serverGet<Catalogue>("/seo/catalogue", 900).catch(() => null), loadAreaIndex()]);
  const catalogue = response?.data;
  if (!catalogue) throw new Error("Catalogue unavailable");

  const category = catalogue.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  if (!locationSlug) return { catalogue, category, state: null, area: null, areas };

  if (areaParam) {
    // Sellers delivering into an area may be based in another state, so the
    // area list (not the category's states) decides.
    const found = findAreaInIndex(areas, locationSlug, areaParam);
    if (!found || !found.area.categories.some((c) => c.slug === slug)) notFound();
    return { catalogue, category, state: found.state, area: found.area.name, areas };
  }

  const state = stateFromSlug(locationSlug, category.states.map((s) => s.name));
  if (!state) notFound();
  return { catalogue, category, state, area: null, areas };
};

const place = (state: string | null, area: string | null) => (state && area ? areaLabel(area, state) : state ? stateLabel(state) : "Nigeria");

// Areas of a state with listings in a category, most first.
const areasWith = (areas: AreaIndex | null, state: string | null, slug: string) =>
  (areas?.states.find((s) => s.name === state)?.areas ?? [])
    .map((area) => ({ name: area.name, count: area.categories.find((c) => c.slug === slug)?.productCount ?? 0 }))
    .filter((area) => area.count > 0);

const countIn = (category: CatalogueCategory, state: string | null, area: string | null = null, areas: AreaIndex | null = null) =>
  area
    ? areasWith(areas, state, category.slug).find((a) => a.name === area)?.count ?? 0
    : state
      ? category.states.find((s) => s.name === state)?.productCount ?? 0
      : category.productCount;

export const listingMetadata = ({ category, state, area, areas }: Resolved, page: number): Metadata => {
  const count = countIn(category, state, area, areas);
  const where = place(state, area);
  const title = `${category.name} in ${where}${page > 1 ? ` – page ${page}` : ""} – buy from trusted sellers`;
  const description = count
    ? `Shop ${count} ${category.name.toLowerCase()} ${count === 1 ? "listing" : "listings"} from sellers ${area ? "based in or delivering to" : "in"} ${where} on ${SITE_NAME}. Secure Paystack checkout, local delivery or pickup, and delivery-code protection.`
    : `${category.name} from sellers in ${where} on ${SITE_NAME} - new listings are on the way.`;
  const url = `${categoryPath(category.slug, state, area)}${page > 1 ? `?page=${page}` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Empty pages stay out of search results until there's something to show.
    robots: count ? undefined : { index: false, follow: true },
    openGraph: { title, description, url, type: "website", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
};

export default async function CategoryListing({ resolved, page }: { resolved: Resolved; page: number }) {
  const { catalogue, category, state, area, areas } = resolved;
  const where = place(state, area);
  const count = countIn(category, state, area, areas);
  const path = categoryPath(category.slug, state, area);

  const query = new URLSearchParams({ category: category.slug, page: String(page), limit: String(PAGE_SIZE), sort: "newest" });
  if (state) query.set("state", state);
  if (area) query.set("area", area);
  const [products, sellers] = await Promise.all([
    serverGet<Paginated<"products", Product>>(`/products?${query}`)
      .catch(() => null)
      .then((r) => r?.data),
    state && area ? loadAreaSellers(state, area, category.slug) : null,
  ]);
  const items = products?.products ?? [];
  const totalPages = products?.totalPages ?? 1;

  // Other categories with listings in the same place.
  const countHere = (c: CatalogueCategory) => countIn(c, state, area, areas);
  const nearby = catalogue.categories
    .filter((c) => c.slug !== category.slug && countHere(c) > 0)
    .sort((a, b) => countHere(b) - countHere(a))
    .slice(0, 12);

  const crumbs = [
    { name: "Categories", url: "/marketplace/categories" },
    { name: category.name, url: categoryPath(category.slug) },
    ...(state ? [{ name: stateLabel(state), url: categoryPath(category.slug, state) }] : []),
    ...(state && area ? [{ name: area, url: path }] : []),
  ];

  // Areas of this state to drill into (on an area page: its neighbours).
  const stateAreas = areasWith(areas, state, category.slug).slice(0, 30);
  const faq = area ? areaFaq({ place: where, what: category.name.toLowerCase(), sellers }) : null;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: `${SITE_URL}${crumb.url}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${category.name} in ${where}`,
      numberOfItems: items.length,
      itemListElement: items.map((product, index) => ({
        "@type": "ListItem",
        position: (page - 1) * PAGE_SIZE + index + 1,
        url: `${SITE_URL}/marketplace/product/${product.id}`,
        name: product.title,
      })),
    },
    ...(faq ? [faqJsonLd(faq)] : []),
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-1 py-6 sm:px-3 lg:px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3">
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Shop on {SITE_NAME}
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[34px] italic leading-tight text-ink sm:text-[44px]">
          {category.icon && <span className="mr-2 not-italic">{category.icon}</span>}
          {category.name} in {where}
        </h1>
        <p className="max-w-3xl text-[14.5px] leading-relaxed text-muted">
          {count > 0
            ? `${count} ${count === 1 ? "listing" : "listings"} from sellers ${area ? `based in or delivering to ${where}` : state ? `in ${where}` : "across Nigeria"}. Pay securely with Paystack, choose delivery or pickup, and confirm with your delivery code when your order arrives.`
            : `No ${category.name.toLowerCase()} listed ${state ? `in ${where}` : "yet"} - check back soon, or be the first to sell here.`}
        </p>
      </header>

      {sellers && <SellerCards sellers={sellers} title={`Sellers serving ${area}`} />}

      {/* Same category elsewhere */}
      {category.states.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <MapPin size={15} className="text-violet-600 dark:text-violet-400" />
          <LocationChip href={categoryPath(category.slug)} label="All Nigeria" count={category.productCount} active={!state} />
          {category.states.map((s) => (
            <LocationChip key={s.name} href={categoryPath(category.slug, s.name)} label={stateLabel(s.name)} count={s.productCount} active={s.name === state && !area} />
          ))}
          <Link
            href={`/marketplace/products?category=${category.slug}`}
            className="ml-auto hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-violet-300 sm:inline-flex"
          >
            <SlidersHorizontal size={13} /> Filter &amp; sort
          </Link>
        </div>
      )}

      {state && stateAreas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] font-medium text-muted">Areas in {stateLabel(state)}:</span>
          {stateAreas.map((a) => (
            <LocationChip key={a.name} href={categoryPath(category.slug, state, a.name)} label={a.name} count={a.count} active={a.name === area} />
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-6 py-14 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-ink">Nothing here yet</p>
          <p className="mt-1 text-[13px] text-subtle">Sell {category.name.toLowerCase()} in {where}? List your first product on {SITE_NAME}.</p>
          <Link href="/marketplace/sell" className="mt-4 inline-flex h-10 items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white">
            Start selling
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-center gap-2">
          {page > 1 && <PageLink href={`${path}${page > 2 ? `?page=${page - 1}` : ""}`} label="Previous" />}
          <span className="px-3 text-[13px] text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && <PageLink href={`${path}?page=${page + 1}`} label="Next" />}
        </nav>
      )}

      {nearby.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-[15px] font-semibold text-ink">More to shop {state ? `in ${where}` : "on Nestly"}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearby.map((c) => (
              <Link
                key={c.slug}
                href={area ? categoryPath(c.slug, state, area) : categoryPath(c.slug, state && c.states.some((s) => s.name === state) ? state : null)}
                className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                {c.icon && <span className="mr-1">{c.icon}</span>}
                {c.name} <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">{countHere(c)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faq && <FaqSection faq={faq} />}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: ShoppingBag, title: "Pick from local sellers", body: "Every listing shows the seller, their location, delivery zones and reviews from real buyers." },
          { icon: ShieldCheck, title: "Pay securely", body: "Checkout runs on Paystack. Card details never touch the seller." },
          { icon: KeyRound, title: "Confirm with your code", body: "Hand over your delivery code only when your order is in your hands." },
        ].map((step) => (
          <div key={step.title} className="rounded-2xl border border-line bg-surface p-5">
            <step.icon size={18} className="text-violet-600 dark:text-violet-400" />
            <p className="mt-2.5 text-[14px] font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function LocationChip({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active ? "bg-violet-600 text-white" : "border border-line text-ink-2 hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
      }`}
    >
      {label} <span className={`font-[family-name:var(--font-mono)] text-[11.5px] ${active ? "text-white/80" : "text-subtle"}`}>{count}</span>
    </Link>
  );
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-xl border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink-2 hover:border-violet-300">
      {label}
    </Link>
  );
}

export const pageFrom = (value: string | string[] | undefined) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 1 ? n : 1;
};
