import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, KeyRound, MapPin, ShieldCheck, ShoppingBag, SlidersHorizontal } from "lucide-react";

import ProductCard from "@/src/app/(protected)/marketplace/components/product-card";
import { jsonLd, serverGet } from "@/src/lib/server-api";
import { stateFromSlug, stateLabel, stateSlug } from "@/src/lib/locations";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { Paginated } from "@/src/types/api";
import { Catalogue, CatalogueCategory } from "@/src/types/catalogue";
import { Product } from "@/src/types/product";

// Public category pages: "Cakes & Pastries" across Nigeria, or in one state
// ("Cakes & Pastries in Lagos"). Rendered on the server so search engines
// see the listings, with links between states and categories.

export const PAGE_SIZE = 24;

export const categoryPath = (slug: string, state?: string | null) =>
  `/marketplace/categories/${slug}${state ? `/${stateSlug(state)}` : ""}`;

interface Resolved {
  catalogue: Catalogue;
  category: CatalogueCategory;
  state: string | null;
}

// The catalogue, the category and (optionally) the state a URL points at.
// Unknown category or state -> 404.
export const resolveListing = async (slug: string, locationSlug?: string): Promise<Resolved> => {
  const response = await serverGet<Catalogue>("/seo/catalogue", 900).catch(() => null);
  const catalogue = response?.data;
  if (!catalogue) throw new Error("Catalogue unavailable");

  const category = catalogue.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  if (!locationSlug) return { catalogue, category, state: null };
  const state = stateFromSlug(locationSlug, category.states.map((s) => s.name));
  if (!state) notFound();
  return { catalogue, category, state };
};

const place = (state: string | null) => (state ? stateLabel(state) : "Nigeria");

const countIn = (category: CatalogueCategory, state: string | null) =>
  state ? category.states.find((s) => s.name === state)?.productCount ?? 0 : category.productCount;

export const listingMetadata = ({ category, state }: Resolved, page: number): Metadata => {
  const count = countIn(category, state);
  const where = place(state);
  const title = `${category.name} in ${where}${page > 1 ? ` – page ${page}` : ""} – buy from trusted sellers`;
  const description = count
    ? `Shop ${count} ${category.name.toLowerCase()} ${count === 1 ? "listing" : "listings"} from sellers in ${where} on ${SITE_NAME}. Secure Paystack checkout, local delivery or pickup, and delivery-code protection.`
    : `${category.name} from sellers in ${where} on ${SITE_NAME} - new listings are on the way.`;
  const url = `${categoryPath(category.slug, state)}${page > 1 ? `?page=${page}` : ""}`;

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
  const { catalogue, category, state } = resolved;
  const where = place(state);
  const count = countIn(category, state);

  const query = new URLSearchParams({ category: category.slug, page: String(page), limit: String(PAGE_SIZE), sort: "newest" });
  if (state) query.set("state", state);
  const products = (await serverGet<Paginated<"products", Product>>(`/products?${query}`).catch(() => null))?.data;
  const items = products?.products ?? [];
  const totalPages = products?.totalPages ?? 1;

  // Other categories with listings in the same place.
  const nearby = catalogue.categories
    .filter((c) => c.slug !== category.slug && countIn(c, state) > 0)
    .sort((a, b) => countIn(b, state) - countIn(a, state))
    .slice(0, 12);

  const crumbs = [
    { name: "Categories", url: "/marketplace/categories" },
    { name: category.name, url: categoryPath(category.slug) },
    ...(state ? [{ name: stateLabel(state), url: categoryPath(category.slug, state) }] : []),
  ];

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
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-1 py-6 sm:px-3 lg:px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-[13px] scrollbar-hide">
        {crumbs.map((crumb, index) => (
          <span key={crumb.url} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={13} className="shrink-0 text-faint" />}
            {index === crumbs.length - 1 ? (
              <span className="font-medium text-ink">{crumb.name}</span>
            ) : (
              <Link href={crumb.url} className="text-muted hover:text-violet-700 dark:hover:text-violet-300">
                {crumb.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

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
            ? `${count} ${count === 1 ? "listing" : "listings"} from sellers ${state ? `in ${where}` : "across Nigeria"}. Pay securely with Paystack, choose delivery or pickup, and confirm with your delivery code when your order arrives.`
            : `No ${category.name.toLowerCase()} listed ${state ? `in ${where}` : "yet"} - check back soon, or be the first to sell here.`}
        </p>
      </header>

      {/* Same category elsewhere */}
      {category.states.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <MapPin size={15} className="text-violet-600 dark:text-violet-400" />
          <LocationChip href={categoryPath(category.slug)} label="All Nigeria" count={category.productCount} active={!state} />
          {category.states.map((s) => (
            <LocationChip key={s.name} href={categoryPath(category.slug, s.name)} label={stateLabel(s.name)} count={s.productCount} active={s.name === state} />
          ))}
          <Link
            href={`/marketplace/products?category=${category.slug}`}
            className="ml-auto hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 hover:border-violet-300 sm:inline-flex"
          >
            <SlidersHorizontal size={13} /> Filter &amp; sort
          </Link>
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
          {page > 1 && <PageLink href={`${categoryPath(category.slug, state)}${page > 2 ? `?page=${page - 1}` : ""}`} label="Previous" />}
          <span className="px-3 text-[13px] text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && <PageLink href={`${categoryPath(category.slug, state)}?page=${page + 1}`} label="Next" />}
        </nav>
      )}

      {nearby.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-[15px] font-semibold text-ink">More to shop {state ? `in ${where}` : "on Nestly"}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearby.map((c) => (
              <Link
                key={c.slug}
                href={categoryPath(c.slug, state && c.states.some((s) => s.name === state) ? state : null)}
                className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                {c.icon && <span className="mr-1">{c.icon}</span>}
                {c.name} <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">{countIn(c, state)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

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
