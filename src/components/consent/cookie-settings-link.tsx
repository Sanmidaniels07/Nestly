"use client";

import { adTagsConfigured, openCookieSettings } from "@/src/lib/ad-tags";

// Reopens the cookie banner to change the choice. Nothing to change (and
// no link) until an advertising tag is set up.
export default function CookieSettingsLink({ className }: { className?: string }) {
  if (!adTagsConfigured) return null;
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
