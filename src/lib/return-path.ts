// Remembers the last regular page a user was on, so pages people visit
// in passing (Terms, Privacy, Seller Agreement, the guides) can send them
// back there, including when they were opened in a new tab.

const KEY = "nestly:return-path";

// Each also covers the pages under it (/guides covers /guides/sellers).
export const PASSING_PATHS = ["/terms", "/privacy", "/seller-terms", "/guides"];

const isPassing = (path: string) =>
  PASSING_PATHS.some((p) => path === p || ["/", "?", "#"].some((next) => path.startsWith(`${p}${next}`)));

export const rememberPath = (path: string) => {
  if (isPassing(path)) return;
  try {
    localStorage.setItem(KEY, path);
  } catch {
    // Storage blocked (private mode) - the back link falls back to home.
  }
};

export const readReturnPath = (): string | null => {
  try {
    const path = localStorage.getItem(KEY);
    // Only same-site paths, never a full URL.
    return path && path.startsWith("/") && !path.startsWith("//") && !isPassing(path) ? path : null;
  } catch {
    return null;
  }
};
