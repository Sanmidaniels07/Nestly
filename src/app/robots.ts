import type { MetadataRoute } from "next";

import { isStaging } from "../lib/environment";
import { SITE_URL } from "../lib/site";

// Staging must never show up in search results; production stays crawlable
// except account-only areas, and points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings", "/admin", "/messages", "/notifications", "/marketplace/checkout", "/marketplace/payment", "/marketplace/cart", "/verify-email", "/reset-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
