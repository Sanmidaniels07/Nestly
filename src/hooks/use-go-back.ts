"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// In-memory record of the URLs visited inside the app this session. Lets a
// "Back" button use real browser history (keeping the previous page's tab,
// filters and scroll) when there is an in-app page to return to, and fall
// back to a sensible parent page when the user landed here directly - from a
// shared link, a refresh, or a new tab - where router.back() would leave Nestly.
const visited: string[] = [];

const recordVisit = (url: string) => {
  // Landing on a URL already in the stack means the user went back (possibly
  // several entries at once) - drop everything after it.
  const index = visited.lastIndexOf(url);

  if (index !== -1) {
    visited.length = index + 1;
    return;
  }

  visited.push(url);
};

export function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    recordVisit(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

// Whether `steps` in-app history entries exist behind the current page.
export const canGoBack = (steps = 1) => visited.length > steps;

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
