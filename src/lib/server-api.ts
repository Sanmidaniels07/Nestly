// Fetches public API data on the server for pages search engines and link
// previews read (product and store pages, the sitemap). Cached and
// refreshed every few minutes. Returns null when it's not there (404) or
// the API can't be reached - pages then fall back to loading in the browser.

import { ApiResponse } from "../types/api";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// An API that hangs (e.g. Render swapping servers mid-deploy) must not hang
// the page - or the Vercel build, which gives up on a page after 60s and
// fails. Give up sooner and fall back like any other unreachable API.
const TIMEOUT_MS = 15_000;

export class NotFoundError extends Error {}

export async function serverGet<T>(path: string, revalidate = 300): Promise<ApiResponse<T> | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (response.status === 404) throw new NotFoundError(path);
    if (!response.ok) return null;
    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    return null;
  }
}

// JSON for a <script type="application/ld+json"> - "<" escaped so text
// from listings can't close the script tag.
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
