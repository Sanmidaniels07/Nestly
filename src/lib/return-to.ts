// Only accept internal, same-origin paths — rejects protocol-relative
// URLs ("//evil.com") and the auth pages themselves, so this can never be
// used as an open redirect or loop back into the login flow.
const AUTH_PAGES = ["/login", "/signup", "/session-expired", "/verify-email", "/resend-verification", "/forgot-password", "/reset-password"];

export function getSafeReturnTo(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (AUTH_PAGES.some((page) => value === page || value.startsWith(`${page}?`) || value.startsWith(`${page}/`))) return null;

  return value;
}

// A guest who taps "Add to cart" on a product may first have to sign up
// and verify their email - the ?returnTo= link doesn't survive that trip
// (the verification email opens a fresh page). So the page is also kept
// in this browser for a day and used after they finally log in.
const KEY = "nestly:after-login";
const KEEP_FOR_MS = 24 * 60 * 60 * 1000;

export function rememberReturnTo(path: string | null | undefined) {
  const safe = getSafeReturnTo(path);
  if (!safe) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ path: safe, at: Date.now() }));
  } catch {
    // Storage blocked (private mode) - they land on the dashboard instead.
  }
}

export function rememberedReturnTo(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { path, at } = JSON.parse(raw) as { path?: string; at?: number };
    if (!at || Date.now() - at > KEEP_FOR_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return getSafeReturnTo(path);
  } catch {
    return null;
  }
}

export function forgetReturnTo() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing stored.
  }
}
