"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";

import { useSellerReadiness } from "@/src/hooks/use-seller-readiness";

// "Finish setting up" - shown to approved sellers until buyers can actually
// order from them (store, payout account, delivery zones or pickup, a
// published product). Lists exactly what's left; no dismiss.
export default function SetupReminderBanner() {
  const { data: readiness } = useSellerReadiness();
  if (!readiness || readiness.ready) return null;

  const steps = readiness.missing;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
          <CircleAlert size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-ink">Buyers can&apos;t order from you yet</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
            {steps.length === 1 ? "One thing left to finish setting up:" : `${steps.length} things left to finish setting up:`}
          </p>
        </div>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {steps.map((step) => (
          <li key={step.key}>
            <Link
              href={step.path}
              className="group flex h-full items-start justify-between gap-3 rounded-xl border border-amber-200/80 bg-surface px-3.5 py-3 transition-colors hover:border-amber-400 dark:border-amber-500/20"
            >
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-ink">{step.title}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-muted">{step.why}</span>
              </span>
              <ArrowRight size={16} className="mt-0.5 shrink-0 text-amber-600 transition-transform group-hover:translate-x-0.5 dark:text-amber-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
