// Advertising tags: Meta Pixel, TikTok Pixel and the Google Ads tag let
// those platforms show Nestly ads to people who visited (retargeting) and
// count sign-ups that came from ads. They set advertising cookies, so under
// the NDPA nothing loads until the visitor says yes in the cookie banner -
// and the banner only appears once at least one ID below is set.
//
// They only ever see public pages (home, guides, shop, store and product
// pages), never account pages such as orders, messages or settings.

const env = (value: string | undefined, pattern: RegExp) => (value && pattern.test(value.trim()) ? value.trim() : null);

export const AD_IDS = {
  meta: env(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{5,20}$/),
  tiktok: env(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID, /^[A-Z0-9]{10,30}$/i),
  // "AW-123456789"; the sign-up conversion label comes from Google Ads.
  googleAds: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d{5,15}$/),
  googleAdsSignupLabel: env(process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL, /^[\w-]{4,40}$/),
};

export const adTagsConfigured = Boolean(AD_IDS.meta || AD_IDS.tiktok || AD_IDS.googleAds);

// ---- The visitor's choice ----

export type AdConsent = "granted" | "denied" | null; // null: not asked yet

const KEY = "nestly.adConsent";
// Ask again after a year.
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const read = (): AdConsent => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as { choice?: string; at?: number } | null;
    if (!saved?.at || Date.now() - saved.at > MAX_AGE_MS) return null;
    return saved.choice === "granted" || saved.choice === "denied" ? saved.choice : null;
  } catch {
    return null;
  }
};

let current: AdConsent | undefined;
const listeners = new Set<() => void>();

export const getAdConsent = (): AdConsent => (current ??= read());

export const subscribeAdConsent = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Cookies the three tags set on nestlyapp.site.
const AD_COOKIE = /^(_fbp|_fbc|_ttp|_tt_enable_cookie|ttcsid.*|_gcl_.*)$/;

const clearAdCookies = () => {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!AD_COOKIE.test(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
  }
};

export const setAdConsent = (choice: "granted" | "denied") => {
  const before = getAdConsent();
  try {
    localStorage.setItem(KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {
    // Storage unavailable - the choice lasts until the page closes.
  }
  current = choice;
  listeners.forEach((listener) => listener());

  // Taking a yes back: the tags are already running in this page, so clear
  // their cookies and reload without them.
  if (before === "granted" && choice === "denied") {
    clearAdCookies();
    location.reload();
  }
};

// "Cookie settings" links reopen the banner.
const openers = new Set<() => void>();
export const openCookieSettings = () => openers.forEach((open) => open());
export const onOpenCookieSettings = (open: () => void) => {
  openers.add(open);
  return () => {
    openers.delete(open);
  };
};

// ---- Loading the tags ----

const AD_PAGES = [
  /^\/$/,
  /^\/(features|preview|signup|seller-terms)$/,
  /^\/guides(\/|$)/,
  /^\/marketplace\/(categories|locations)(\/|$)/,
  /^\/marketplace\/(product|seller)\/.+/,
];

/** Public pages the tags may see. */
export const isAdPage = (path: string) => AD_PAGES.some((page) => page.test(path));

type Call = (...args: unknown[]) => void;
type Fbq = Call & { callMethod?: Call; queue: unknown[]; push: Call; loaded: boolean; version: string; disablePushState?: boolean };
type Ttq = unknown[] & Record<string, unknown> & { page: () => void; track: (event: string) => void };
type AdWindow = Window & { fbq?: Fbq; _fbq?: Fbq; ttq?: Ttq; TiktokAnalyticsObject?: string; dataLayer?: unknown[]; gtag?: Call };

const win = () => window as AdWindow;

const addScript = (src: string) => {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

// Meta's base code: calls queue up until fbevents.js loads.
const loadMeta = (id: string) => {
  const w = win();
  if (w.fbq) return;
  const fbq = ((...args: unknown[]) => (fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args))) as Fbq;
  Object.assign(fbq, { push: fbq, loaded: true, version: "2.0", queue: [] });
  w.fbq = w._fbq = fbq;
  // Page views are sent by hand, and only for public pages.
  fbq.disablePushState = true;
  addScript("https://connect.facebook.net/en_US/fbevents.js");
  fbq("set", "autoConfig", false, id);
  fbq("init", id);
};

// TikTok's base code: calls queue up until events.js loads.
const loadTikTok = (id: string) => {
  const w = win();
  if (w.ttq) return;
  const methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
  type Queue = unknown[] & Record<string, unknown>;
  const defer = (target: Queue, method: string) => {
    target[method] = (...args: unknown[]) => target.push([method, ...args]);
  };
  const ttq = [] as unknown as Ttq;
  for (const method of methods) defer(ttq, method);

  const src = "https://analytics.tiktok.com/i18n/pixel/events.js";
  const instances: Record<string, Queue> = { [id]: Object.assign([] as unknown as Queue, { _u: src }) };
  Object.assign(ttq, {
    methods,
    setAndDefer: defer,
    instance: (name: string) => {
      const queue = instances[name] ?? ([] as unknown as Queue);
      for (const method of methods) defer(queue, method);
      return queue;
    },
    _i: instances,
    _t: { [id]: Date.now() },
    _o: { [id]: {} },
  });
  w.TiktokAnalyticsObject = "ttq";
  w.ttq = ttq;
  addScript(`${src}?sdkid=${id}&lib=ttq`);
};

// Google's gtag.js. gtag must push the arguments object itself.
const loadGoogleAds = (id: string) => {
  const w = win();
  if (w.gtag) return;
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("consent", "default", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "denied" });
  w.gtag("js", new Date());
  w.gtag("config", id, { send_page_view: false });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
};

/** Loads whichever tags have IDs. Only call after the visitor said yes. */
export const loadAdTags = () => {
  if (AD_IDS.meta) loadMeta(AD_IDS.meta);
  if (AD_IDS.tiktok) loadTikTok(AD_IDS.tiktok);
  if (AD_IDS.googleAds) loadGoogleAds(AD_IDS.googleAds);
};

export const trackAdPageView = () => {
  const w = win();
  w.fbq?.("track", "PageView");
  w.ttq?.page();
  if (AD_IDS.googleAds) w.gtag?.("event", "page_view", { send_to: AD_IDS.googleAds });
};

/** A new account - the conversion ads are optimised for. Call before leaving the sign-up page. */
export const trackAdSignUp = () => {
  if (getAdConsent() !== "granted") return;
  const w = win();
  w.fbq?.("track", "CompleteRegistration");
  w.ttq?.track("CompleteRegistration");
  if (AD_IDS.googleAds && AD_IDS.googleAdsSignupLabel) w.gtag?.("event", "conversion", { send_to: `${AD_IDS.googleAds}/${AD_IDS.googleAdsSignupLabel}` });
};
