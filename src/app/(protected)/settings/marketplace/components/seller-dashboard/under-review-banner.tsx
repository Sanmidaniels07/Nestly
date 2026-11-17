"use client";

import { Clock } from "lucide-react";

import { naira } from "@/src/lib/payment-link";

// Quick-start stores sell before Nestly has reviewed them. Says what that
// means until the review - earnings held, one order capped - and how much
// is waiting, so the seller knows their money isn't lost.
export default function UnderReviewBanner({ orderLimit, held }: { orderLimit?: number | null; held?: number | null }) {
  return (
    <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10 sm:p-5">
      <Clock size={18} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-[14px] font-semibold text-amber-900 dark:text-amber-100">Nestly is reviewing your new store</p>
          {!!held && held > 0 && (
            <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-100">
              <span className="font-[family-name:var(--font-mono)]">{naira(held)}</span> waiting · released after your review
            </p>
          )}
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-amber-900/85 dark:text-amber-100/85">
          You can sell now. Until the review (usually within a day), your earnings are held safely and paid once you&apos;re
          reviewed and the buyer has their order
          {orderLimit ? <>, and one order can be up to {naira(orderLimit)}</> : null}. We&apos;ll let you know when it&apos;s done.
        </p>
      </div>
    </section>
  );
}
