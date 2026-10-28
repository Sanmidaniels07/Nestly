import type { MetadataRoute } from "next";

import { isStaging } from "../lib/environment";
import { SITE_URL } from "../lib/site";

// Staging must never show up in search results; production stays crawlable
// except account-only areas, and points crawlers at the sitemap. AI search
// and assistant crawlers are welcomed by name (a crawler with its own group
// ignores "*", so they get the same rules) - /llms.txt summarises the site
// for them.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
];

const PRIVATE = ["/settings", "/admin", "/messages", "/notifications", "/marketplace/checkout", "/marketplace/payment", "/marketplace/cart", "/verify-email", "/reset-password"];
export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
