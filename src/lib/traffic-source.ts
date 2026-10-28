// Where a visitor came from, sent with sign-ups and orders so the admin
// overview can show which channels bring people who join and buy. Worked
// out once per page load from ?utm_source, a seller's ?ref= link, a payment
// link, the referring site or the in-app browser. The latest non-direct
// source in the past 30 days wins: someone who found Nestly on Google and
// came back by typing the address still counts for Google.

export type TrafficSource =
  | "GOOGLE"
  | "OTHER_SEARCH"
  | "WHATSAPP"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TIKTOK"
  | "X"
  | "SELLER_LINK"
  | "PAYMENT_LINK"
  | "OTHER_SITE"
  | "DIRECT";

const KEY = "nestly:source";
const KEEP_MS = 30 * 24 * 60 * 60 * 1000;

interface Stored {
  source: TrafficSource;
  at: number;
}

const BY_NAME: [RegExp, TrafficSource][] = [
  [/google/, "GOOGLE"],
  [/bing|yahoo|duckduckgo|yandex|ecosia|baidu|brave/, "OTHER_SEARCH"],
  [/whatsapp|^wa$|wa\.me/, "WHATSAPP"],
  [/instagram|^ig$/, "INSTAGRAM"],
  [/facebook|^fb$|fb\.com|messenger/, "FACEBOOK"],
  [/tiktok/, "TIKTOK"],
  [/twitter|^x$|(^|\.)x\.com$|^t\.co$/, "X"],
];

const byName = (name: string): TrafficSource | null => BY_NAME.find(([pattern]) => pattern.test(name))?.[1] ?? null;

const fromReferrer = (referrer: string): TrafficSource | null => {
  if (!referrer) return null;
  // Android's Google app sends android-app://com.google.android.googlequicksearchbox.
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!host || host === window.location.hostname || host.endsWith("nestlyapp.site")) return null;
  return byName(host) ?? "OTHER_SITE";
};

// In-app browsers often send no referrer, but say who they are.
const fromInAppBrowser = (userAgent: string): TrafficSource | null => {
  if (/Instagram/i.test(userAgent)) return "INSTAGRAM";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(userAgent)) return "FACEBOOK";
  if (/musical_ly|TikTok|BytedanceWebview/i.test(userAgent)) return "TIKTOK";
  if (/WhatsApp/i.test(userAgent)) return "WHATSAPP";
  return null;
};

const detect = (search: string, path: string): TrafficSource => {
  const params = new URLSearchParams(search);
  const utm = params.get("utm_source")?.trim().toLowerCase();
  if (utm) return byName(utm) ?? "OTHER_SITE";
  if (params.get("ref")) return "SELLER_LINK";
  if (path.startsWith("/pay/")) return "PAYMENT_LINK";
  return fromReferrer(document.referrer) ?? fromInAppBrowser(navigator.userAgent) ?? "DIRECT";
};

const read = (): Stored | null => {
  try {
    const raw = localStorage.getItem(KEY);
    const stored = raw ? (JSON.parse(raw) as Stored) : null;
    return stored && Date.now() - stored.at < KEEP_MS ? stored : null;
  } catch {
    return null;
  }
};

let thisVisit: TrafficSource | null = null;

/** Call on page views; only the first one of each page load counts. */
export const captureTrafficSource = (search: string, path: string) => {
  if (thisVisit) return;
  thisVisit = detect(search, path);

  const stored = read();
  if (thisVisit === "DIRECT" && stored) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ source: thisVisit, at: Date.now() } satisfies Stored));
  } catch {
    // Storage blocked - this visit's source is still used below.
  }
};

/** The source to send with a sign-up or order. */
export const trafficSource = (): TrafficSource | undefined => read()?.source ?? thisVisit ?? undefined;
