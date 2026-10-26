"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, X } from "lucide-react";

import { SellerProfile } from "@/src/types/seller";

const SNOOZE_DAYS = 7;
const keyFor = (sellerId: string) => `nestly:cac-banner-snoozed:${sellerId}`;

const isSnoozed = (sellerId: string) => {
  try {
    const until = Number(localStorage.getItem(keyFor(sellerId)));
    return !!until && until > Date.now();
  } catch {
    return false;
  }
};

// Nudges sellers without a CAC number towards the verified badge. "Later"
// hides it for a week; it stops for good once a number is added.
export default function CacReminderBanner({ seller }: { seller: SellerProfile }) {
  // Seller Hub only renders in the browser (after the session check).
  const [snoozed, setSnoozed] = useState(() => isSnoozed(seller.id));

  if (seller.cacNumber || snoozed) return null;

  const snooze = () => {
    try {
      localStorage.setItem(keyFor(seller.id), String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
    } catch {
      // Storage blocked - it just hides for this visit.
    }
    setSnoozed(true);
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 pr-11 sm:flex-row sm:items-center sm:p-5 sm:pr-12 dark:border-emerald-500/30 dark:from-emerald-500/10 dark:to-teal-500/10">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
        <BadgeCheck size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-ink">Get a verified badge on your store</p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
          Add your CAC registration number - buyers are more likely to order from verified sellers.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={snooze} className="h-10 rounded-xl px-3.5 text-[13px] font-medium text-muted hover:bg-white/60 dark:hover:bg-white/5">
          Later
        </button>
        <Link
          href="/settings/marketplace?tab=store#business-verification"
          className="flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-[13px] font-semibold text-white hover:bg-emerald-700"
        >
          Add CAC number
        </Link>
      </div>
      <button
        type="button"
        onClick={snooze}
        aria-label="Hide for a week"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-subtle hover:bg-white/60 dark:hover:bg-white/5"
      >
        <X size={15} />
      </button>
    </div>
  );
}
