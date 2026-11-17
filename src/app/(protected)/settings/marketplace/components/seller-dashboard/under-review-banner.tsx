"use client";

import { Clock } from "lucide-react";

import { naira } from "@/src/lib/payment-link";

// Quick-start stores sell before Nestly has reviewed them. Says what that
// means until the review: earnings held, one order capped.
export default function UnderReviewBanner({ orderLimit }: { orderLimit?: number | null }) {
  return (
    <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10 sm:p-5">
      <Clock size={18} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
      <div>
        <p className="text-[14px] font-semibold text-amber-900 dark:text-amber-100">Nestly is reviewing your new store</p>
        <p className="mt-1 text-[13px] leading-relaxed text-amber-900/85 dark:text-amber-100/85">
          You can sell now. Until the review (usually within a day), your earnings are held safely and paid once you&apos;re
          reviewed and the buyer has their order
          {orderLimit ? <>, and one order can be up to {naira(orderLimit)}</> : null}. We&apos;ll let you know when it&apos;s done.
        </p>
      </div>
    </section>
  );
}
