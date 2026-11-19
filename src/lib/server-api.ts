// Fetches public API data on the server for pages search engines and link
// previews read (product and store pages, the sitemap). Cached and
// refreshed every few minutes. Returns null when it's not there (404) or
// the API can't be reached - pages then fall back to loading in the browser.

import { unstable_cache } from "next/cache";

import { ApiResponse } from "../types/api";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// An API that hangs (e.g. Render swapping servers mid-deploy) must not hang
// the page - or the Vercel build, which gives up on a page after 60s and
// fails. Give up sooner and fall back like any other unreachable API.
const TIMEOUT_MS = 15_000;

export class NotFoundError extends Error {}

// What the API said. "missing" (404) is cached like a normal answer: Next's
// fetch cache only stores 200s, so when a store or product was taken down
// the old copy was never replaced and the page kept showing it.
type Loaded = { found: true; body: unknown } | { found: false };

const load = async (path: string): Promise<Loaded> => {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (response.status === 404) return { found: false };
  // Errors and an unreachable API throw, so they are never cached - the
  // next request tries again.
  if (!response.ok) throw new Error(`API ${response.status} for ${path}`);
  return { found: true, body: await response.json() };
};

export async function serverGet<T>(path: string, revalidate = 300): Promise<ApiResponse<T> | null> {
  if (!API_URL) return null;
  let loaded: Loaded;
  try {
    loaded = await unstable_cache(() => load(path), ["server-get", path, String(revalidate)], { revalidate })();
  } catch {
    return null;
  }
  if (!loaded.found) throw new NotFoundError(path);
  return loaded.body as ApiResponse<T>;
}

// JSON for a <script type="application/ld+json"> - "<" escaped so text
// from listings can't close the script tag.
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
