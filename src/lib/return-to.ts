// Only accept internal, same-origin paths — rejects protocol-relative
// URLs ("//evil.com") and the auth pages themselves, so this can never be
// used as an open redirect or loop back into the login flow.
export function getSafeReturnTo(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (value === "/login" || value.startsWith("/login?")) return null;
  if (value === "/session-expired" || value.startsWith("/session-expired?")) return null;

  return value;
}
