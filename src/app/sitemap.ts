import type { MetadataRoute } from "next";

import { isStaging } from "../lib/environment";
import { serverGet } from "../lib/server-api";
import { PUBLIC_ROUTES, SITE_URL } from "../lib/site";
import { stateSlug } from "../lib/locations";
import { Catalogue } from "../types/catalogue";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/features": 0.8,
  "/preview": 0.7,
  "/signup": 0.6,
  "/seller-terms": 0.4,
  "/terms": 0.3,
  "/privacy": 0.3,
  "/login": 0.3,
};

// New products show up within the hour.
export const revalidate = 3600;

interface SitemapEntries {
  products: { id: string; updatedAt: string }[];
  stores: { slug: string; updatedAt: string }[];
}

// Public pages plus every live product and store - everything behind
// login is noindex. Staging lists none.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isStaging) return [];

  const pages: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: PRIORITY[path] ?? 0.5,
  }));

  // If the API can't be reached the sitemap still lists the main pages.
  const [entries, catalogue] = await Promise.all([
    serverGet<SitemapEntries>("/seo/sitemap", revalidate).then((r) => r?.data).catch(() => undefined),
    serverGet<Catalogue>("/seo/catalogue", revalidate).then((r) => r?.data).catch(() => undefined),
  ]);

  // Category pages with listings: across Nigeria and per state.
  const categoryPages: MetadataRoute.Sitemap = (catalogue?.categories ?? [])
    .filter((category) => category.productCount > 0)
    .flatMap((category) => [
      {
        url: `${SITE_URL}/marketplace/categories/${category.slug}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : undefined,
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      ...category.states.map((state) => ({
        url: `${SITE_URL}/marketplace/categories/${category.slug}/${stateSlug(state.name)}`,
        lastModified: new Date(state.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ]);
  const hub = catalogue ? [{ url: `${SITE_URL}/marketplace/categories`, changeFrequency: "daily" as const, priority: 0.8 }] : [];

  if (!entries) return [...pages, ...hub, ...categoryPages];

  return [
    ...pages,
    ...hub,
    ...categoryPages,
    ...entries.stores.map((store) => ({
      url: `${SITE_URL}/marketplace/seller/${encodeURIComponent(store.slug)}`,
      lastModified: new Date(store.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...entries.products.map((product) => ({
      url: `${SITE_URL}/marketplace/product/${encodeURIComponent(product.id)}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
