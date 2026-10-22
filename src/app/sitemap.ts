import type { MetadataRoute } from "next";

import { isStaging } from "../lib/environment";
import { PUBLIC_ROUTES, SITE_URL } from "../lib/site";

const PRIORITY: Record<string, number> = { "/": 1, "/features": 0.8, "/preview": 0.7, "/signup": 0.6, "/login": 0.3 };

// Only public pages - everything behind login is noindex. Staging lists none.
export default function sitemap(): MetadataRoute.Sitemap {
  if (isStaging) return [];

  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: PRIORITY[path] ?? 0.5,
  }));
}
