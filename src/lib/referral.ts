import { api } from "./axios";

// Seller share links carry ?ref=<store code>. We keep the code for 30 days
// so a visitor who signs up later still counts for that store, and tell the
// API about the visit at most once a day per code.

const KEY = "nestly:ref";
const VISIT_KEY = "nestly:ref-visit";
const KEEP_MS = 30 * 24 * 60 * 60 * 1000;
const CODE = /^[A-Z0-9]{4,20}$/;

interface Stored {
  code: string;
  at: number;
}

const read = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / storage blocked - the link just won't be remembered.
  }
};

/** Call on every page view; picks up ?ref= when present. */
export const captureReferral = (search: string, path: string) => {
  const code = new URLSearchParams(search).get("ref")?.trim().toUpperCase();
  if (!code || !CODE.test(code)) return;

  // The latest link someone followed wins.
  write(KEY, { code, at: Date.now() } satisfies Stored);

  const today = new Date().toISOString().slice(0, 10);
  const visit = read<{ code: string; day: string }>(VISIT_KEY);
  if (visit?.code === code && visit.day === today) return;
  write(VISIT_KEY, { code, day: today });

  api.post("/referrals/visit", { code, path }).catch(() => {});
};

/** The share-link code to send with signup, if one is still fresh. */
export const referralCode = () => {
  const stored = read<Stored>(KEY);
  return stored && Date.now() - stored.at < KEEP_MS ? stored.code : undefined;
};
