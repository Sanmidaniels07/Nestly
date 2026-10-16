"use client";

import { ShieldAlert } from "lucide-react";

export default function SuspendedStoreBanner() {
  return (
    <section className="flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 sm:p-5">
      <ShieldAlert size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
      <div>
        <p className="text-[14px] font-semibold text-red-700 dark:text-red-300">Your store is suspended</p>
        <p className="mt-1 text-[13px] leading-relaxed text-red-600/90">
          Your store and products are hidden from buyers across the marketplace. You can
          still manage your products, orders, and settings from here. Contact support if
          you think this is a mistake.
        </p>
      </div>
    </section>
  );
}
