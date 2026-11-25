"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";

import { useSellerReadiness } from "@/src/hooks/use-seller-readiness";
import { SellerProfile } from "@/src/types/seller";
import CacReminderBanner from "./cac-reminder-banner";

// One card at the top of Seller Hub: the single most important thing to do
// next, instead of a stack of banners. While buyers can't order yet, that's
// the next setup step (with "1 of 3 left"); once the store is ready, adding
// the CAC number; after that, nothing.
export default function SellerNextStep({ seller }: { seller?: SellerProfile }) {
  const approved = seller?.status === "APPROVED";
  const { data: readiness } = useSellerReadiness(approved);
  if (!approved || !readiness) return null;

  if (!readiness.ready && readiness.missing.length > 0) {
    const [next] = readiness.missing;
    const left = readiness.missing.length;
    const total = 4; // store, payout, delivery, a product
    const done = Math.max(0, total - left);
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
            <CircleAlert size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-amber-800/80 dark:text-amber-200/80">
              Next step · {left === 1 ? "last one before buyers can order" : `${left} left before buyers can order`}
            </p>
            <p className="mt-0.5 text-[16px] font-semibold text-ink">{next.title}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink-2">{next.why}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={next.path}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[14px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(91,33,182,0.7)] transition hover:brightness-110"
          >
            {next.title} <ArrowRight size={16} />
          </Link>
          <div className="flex flex-1 items-center gap-1.5" aria-label={`${done} of ${total} done`}>
            {Array.from({ length: total }).map((_, index) => (
              <span key={index} className={`h-1.5 flex-1 rounded-full ${index < done ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-500/25"}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Ready to sell: the CAC number is what's left (it can earn the verified badge).
  if (!seller.cacNumber) return <CacReminderBanner />;
  return null;
}
