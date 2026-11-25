import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SITE_PAGES, STORE_SLUG } from "./lib/store-link";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// The short links sellers share, handled here before any page renders so
// they're real redirects - link previews on WhatsApp, Instagram and X follow
// them (a redirect from inside a streamed page arrives as "200 OK" plus a
// browser-side jump they ignore):
//
//   nestlyapp.site/{store}              -> the store page
//   nestlyapp.site/{store}/{collection} -> that collection (/c/{store}/{collection})
//
// The website's own pages (/login, /feed, /settings/profile...) pass straight
// through. Any other first name is looked up as a store - its current name or
// one it had before a rename - and the visit is tagged with the store's
// referral code, so buyers who join through it count as the seller's.
// Unknown names fall through to the normal "page not found".
export async function proxy(request: NextRequest) {
  const parts = request.nextUrl.pathname.slice(1).split("/").map((part) => decodeURIComponent(part).toLowerCase());
  const [name, collection] = parts;
  if (!API_URL || parts.length > 2 || name.length > 120 || !STORE_SLUG.test(name) || SITE_PAGES.has(name)) return NextResponse.next();
  if (collection !== undefined && (collection.length > 120 || !STORE_SLUG.test(collection))) return NextResponse.next();

  const pathFor = (store: string) => (collection ? `/c/${store}/${collection}` : `/marketplace/seller/${store}`);
  try {
    const response = await fetch(`${API_URL}/stores/${name}/link`, { signal: AbortSignal.timeout(5000) });
    if (response.status === 404) return NextResponse.next();
    if (!response.ok) throw new Error(String(response.status));
    const { data } = (await response.json()) as { data: { slug: string; referralCode: string | null } };
    const target = new URL(pathFor(data.slug), request.url);
    if (data.referralCode) target.searchParams.set("ref", data.referralCode);
    // Keep anything else on the link (e.g. utm tags).
    request.nextUrl.searchParams.forEach((value, key) => {
      if (!target.searchParams.has(key)) target.searchParams.set(key, value);
    });
    return NextResponse.redirect(target, 307);
  } catch {
    // API slow or down: the page tries again itself.
    return NextResponse.redirect(new URL(pathFor(name), request.url), 307);
  }
}

// One- and two-segment paths (nestlyapp.site/a, nestlyapp.site/a/b). Paths
// with a dot (files like /sw.js, /robots.txt) and site pages are skipped in
// the function above.
export const config = {
  matcher: ["/:name", "/:name/:collection"],
};
