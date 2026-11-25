import { SITE_URL } from "./site";

// The website's own top-level pages (and names kept for later). The API
// won't give a store one of these slugs (utils/slugify RESERVED_STORE_SLUGS);
// older stores that already have one keep the long link.
export const SITE_PAGES = new Set([
  "about", "account", "admin", "api", "app", "apple-icon", "blog", "cart", "chip-in", "checkout", "communities",
  "contact", "dashboard", "demo", "events", "explore", "faq", "features", "feed", "feeds", "followers", "following",
  "forgot-password", "gift", "guides", "hashtags", "help", "home", "icon", "live", "llms", "login", "logout", "me",
  "manifest", "marketplace", "messages", "nestly", "notifications", "orders", "partners", "pay", "post", "pricing",
  "privacy", "profile", "resend-verification", "reset-password", "robots", "s", "search", "sell", "seller",
  "seller-terms", "session-expired", "settings", "shop", "signup", "sitemap", "staging", "store", "stores",
  "support", "terms", "users", "verify-email", "welcome", "www",
]);

export const STORE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// What sellers share: nestlyapp.site/{slug}. It opens their store page and
// counts the visit as their referral (src/proxy.ts).
export function storeShareUrl(slug: string, referralCode?: string | null) {
  if (STORE_SLUG.test(slug) && !SITE_PAGES.has(slug)) return `${SITE_URL}/${slug}`;
  return `${SITE_URL}/marketplace/seller/${slug}${referralCode ? `?ref=${referralCode}` : ""}`;
}

// Shown to people: "nestlyapp.site/tolas-fabrics" (no https://www.).
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");
