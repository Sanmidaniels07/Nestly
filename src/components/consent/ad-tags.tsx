"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import { adTagsConfigured, getAdConsent, isAdPage, loadAdTags, subscribeAdConsent, trackAdPageView } from "@/src/lib/ad-tags";

// Loads the advertising tags once the visitor has allowed them, and counts
// a page view for each public page they open (see lib/ad-tags).
export default function AdTags() {
  const consent = useSyncExternalStore(subscribeAdConsent, getAdConsent, () => null);
  const pathname = usePathname();

  useEffect(() => {
    if (!adTagsConfigured || consent !== "granted" || !isAdPage(pathname)) return;
    loadAdTags();
    trackAdPageView();
  }, [consent, pathname]);

  return null;
}
