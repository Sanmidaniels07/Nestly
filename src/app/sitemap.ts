import type { MetadataRoute } from "next";

import { isStaging } from "../lib/environment";
import { serverGet } from "../lib/server-api";
import { PUBLIC_ROUTES, SITE_URL } from "../lib/site";

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
  const entries = (await serverGet<SitemapEntries>("/seo/sitemap", revalidate).catch(() => null))?.data;
  if (!entries) return pages;

  return [
    ...pages,
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
