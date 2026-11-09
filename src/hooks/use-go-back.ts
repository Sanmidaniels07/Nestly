"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// A mirror of this tab's browser history inside Nestly, so every "Back"
// button returns to the page the user actually came from (keeping its tab,
// filters and scroll) - and falls back to a sensible parent page when there
// is no Nestly page behind this one (shared link, new tab, landed from
// Google), where router.back() would leave Nestly or do nothing.
//
// It follows every push, replace and back/forward, so pages that swap their
// own URL (router.replace for filters, tabs, form steps) don't confuse it,
// and it survives a refresh (kept in sessionStorage, which is per tab).

type Stack = { urls: string[]; at: number };
type HistoryUrl = string | URL | null | undefined;

const KEY = "nestly:history";
let stack: Stack | null = null;

const here = () => `${window.location.pathname}${window.location.search}`;

// Same-site path + query of a pushState/replaceState URL; null for others.
const normalize = (url: HistoryUrl): string | null => {
  if (url == null || url === "") return here();
  try {
    const parsed = new URL(String(url), window.location.href);
    return parsed.origin === window.location.origin ? `${parsed.pathname}${parsed.search}` : null;
  } catch {
    return null;
  }
};

const save = () => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(stack));
  } catch {
    // Storage blocked - the in-memory copy still works until a refresh.
  }
};

const readSaved = (): Stack | null => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    const valid =
      saved &&
      Array.isArray(saved.urls) &&
      saved.urls.every((u: unknown) => typeof u === "string") &&
      Number.isInteger(saved.at) &&
      saved.at >= 0 &&
      saved.at < saved.urls.length;
    return valid ? saved : null;
  } catch {
    return null;
  }
};

// Position of `url` closest to `from`, looking back first (the usual case).
const nearest = (urls: string[], url: string, from: number) => {
  for (let i = from; i >= 0; i--) if (urls[i] === url) return i;
  for (let i = from + 1; i < urls.length; i++) if (urls[i] === url) return i;
  return -1;
};

// Rebuilds the stack when the page (re)loads.
const start = (): Stack => {
  const url = here();
  const saved = readSaved();
  const entry = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
  let fromNestly = false;
  try {
    fromNestly = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
  } catch {
    fromNestly = false;
  }

  if (saved) {
    if (entry?.type === "reload" && saved.urls[saved.at] === url) return saved;
    if (entry?.type === "back_forward") {
      const index = nearest(saved.urls, url, saved.at);
      if (index !== -1) return { urls: saved.urls, at: index };
    }
    // A full page load from another Nestly page (e.g. after logging in).
    if (fromNestly) return { urls: [...saved.urls.slice(0, saved.at + 1), url], at: saved.at + 1 };
  }
  return { urls: [url], at: 0 };
};

const pushed = (url: HistoryUrl) => {
  const path = normalize(url);
  if (!stack || !path) return;
  stack = { urls: [...stack.urls.slice(0, stack.at + 1), path], at: stack.at + 1 };
  save();
};

const replaced = (url: HistoryUrl) => {
  const path = normalize(url);
  if (!stack || !path) return;
  stack.urls[stack.at] = path;
  save();
};

const popped = () => {
  if (!stack) return;
  const url = here();
  if (stack.urls[stack.at] === url) return;
  const index = nearest(stack.urls, url, stack.at);
  stack = index !== -1 ? { urls: stack.urls, at: index } : { urls: [url], at: 0 };
  save();
};

const install = () => {
  if (stack || typeof window === "undefined") return;
  stack = start();
  save();

  const { pushState, replaceState } = window.history;
  window.history.pushState = function (data: unknown, unused: string, url?: HistoryUrl) {
    pushState.call(this, data, unused, url);
    pushed(url);
  };
  window.history.replaceState = function (data: unknown, unused: string, url?: HistoryUrl) {
    replaceState.call(this, data, unused, url);
    replaced(url);
  };
  window.addEventListener("popstate", popped);
};

// Mounted once, in the root layout.
export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(install, []);

  // Safety net: if a navigation slipped past the history hooks, record it.
  useEffect(() => {
    if (stack && stack.urls[stack.at] !== here()) pushed(here());
  }, [pathname]);

  return null;
}

// Whether `steps` Nestly pages exist behind the current one in this tab.
export const canGoBack = (steps = 1) =>
  typeof window !== "undefined" && stack !== null && stack.at >= steps && window.history.length > steps;

export const useGoBack = (fallbackHref: string) => {
  const router = useRouter();

  return useCallback(
    (steps = 1) => {
      if (canGoBack(steps)) {
        window.history.go(-steps);
      } else {
        router.replace(fallbackHref);
      }
    },
    [router, fallbackHref]
  );
};
