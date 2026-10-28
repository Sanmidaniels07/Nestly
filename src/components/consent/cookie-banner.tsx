"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

import { adTagsConfigured, getAdConsent, onOpenCookieSettings, setAdConsent, subscribeAdConsent } from "@/src/lib/ad-tags";

// Asks once whether advertising cookies may be used (see lib/ad-tags).
// "No thanks" is as easy as "Allow", and either can be changed later from
// "Cookie settings". Hidden on the server and until an ad ID is set.
export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribeAdConsent, getAdConsent, () => "denied" as const);
  const [reopened, setReopened] = useState(false);

  useEffect(() => onOpenCookieSettings(() => setReopened(true)), []);

  if (!adTagsConfigured || (consent !== null && !reopened)) return null;

  const choose = (choice: "granted" | "denied") => {
    setReopened(false);
    setAdConsent(choice);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md rounded-2xl border border-line bg-surface p-5 shadow-[0_20px_50px_-20px_rgba(15,10,40,0.45)] lg:bottom-5 lg:left-5 lg:right-auto lg:mx-0"
    >
      <p id="cookie-banner-title" className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
        <Cookie size={17} className="text-violet-600 dark:text-violet-400" /> Cookies for Nestly ads
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Can we use advertising cookies from Meta, TikTok and Google? They let us show Nestly ads to people who&apos;ve visited and see which ads
        work. Nestly works exactly the same if you say no.{" "}
        <Link href="/privacy#cookies" className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300">
          Privacy Policy
        </Link>
      </p>
      {reopened && consent !== null && (
        <p className="mt-2 text-[12.5px] text-subtle">Right now: {consent === "granted" ? "allowed" : "not allowed"}.</p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="h-10 rounded-xl border border-line bg-surface text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="h-10 rounded-xl border border-line bg-surface text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
        >
          Allow
        </button>
      </div>
    </div>
  );
}
