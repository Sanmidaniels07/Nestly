import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SITE_PAGES, STORE_SLUG } from "./lib/store-link";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// The store short link sellers share: nestlyapp.site/{slug}. It's handled
// here, before any page renders, so it's a real redirect - link previews on
// WhatsApp, Instagram and X follow it (a redirect from inside a streamed
// page arrives as "200 OK" plus a browser-side jump they ignore).
//
// The website's own pages (/login, /feed...) pass straight through. Any other
// single name is looked up as a store - its current name or one it had before
// a rename - and opens the store page tagged with the store's referral code,
// so buyers who join through it count as the seller's. Unknown names fall
// through to the normal "page not found".
export async function proxy(request: NextRequest) {
  const name = decodeURIComponent(request.nextUrl.pathname.slice(1)).toLowerCase();
  if (!API_URL || name.length > 120 || !STORE_SLUG.test(name) || SITE_PAGES.has(name)) return NextResponse.next();

  try {
    const response = await fetch(`${API_URL}/stores/${name}/link`, { signal: AbortSignal.timeout(5000) });
    if (response.status === 404) return NextResponse.next();
    if (!response.ok) throw new Error(String(response.status));
    const { data } = (await response.json()) as { data: { slug: string; referralCode: string | null } };
    const target = new URL(`/marketplace/seller/${data.slug}`, request.url);
    if (data.referralCode) target.searchParams.set("ref", data.referralCode);
    // Keep anything else on the link (e.g. utm tags).
    request.nextUrl.searchParams.forEach((value, key) => {
      if (!target.searchParams.has(key)) target.searchParams.set(key, value);
    });
    return NextResponse.redirect(target, 307);
  } catch {
    // API slow or down: the store page tries again itself.
    return NextResponse.redirect(new URL(`/marketplace/seller/${name}`, request.url), 307);
  }
}

// One-segment paths only (nestlyapp.site/something). Paths with a dot
// (files like /sw.js, /robots.txt) are skipped in the function above.
export const config = {
  matcher: "/:name",
};
