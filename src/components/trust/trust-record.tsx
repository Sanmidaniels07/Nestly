"use client";

import { BadgeCheck, Clock, ShieldCheck, Sparkles } from "lucide-react";

import { useStoreTrust } from "@/src/hooks/use-store-trust";
import { TRUST_LEVEL, trustFacts } from "@/src/lib/trust";
import { ApiResponse } from "@/src/types/api";
import { StoreTrust } from "@/src/types/trust";

const LEVEL_TONE = {
  TRUSTED: "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/30",
  ESTABLISHED: "bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-400/15 dark:text-violet-200 dark:ring-violet-400/30",
  NEW: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/30",
} as const;

const LEVEL_ICON = { TRUSTED: ShieldCheck, ESTABLISHED: BadgeCheck, NEW: Sparkles } as const;

// The seller's track record on Nestly, from real orders. On the store page
// and the shareable /s/{slug} page.
export default function TrustRecord({
  slug,
  initial,
  heading = "Track record on Nestly",
}: {
  slug: string;
  initial?: ApiResponse<StoreTrust>;
  heading?: string;
}) {
  const { data: trust } = useStoreTrust(slug, initial);
  if (!trust) return null;

  const LevelIcon = LEVEL_ICON[trust.level];

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-label="Seller track record">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">{heading}</h2>
          <p className="mt-0.5 text-[12.5px] text-muted">From real orders paid and delivered through Nestly - sellers can&apos;t edit it.</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ring-1 ${LEVEL_TONE[trust.level]}`}>
          <LevelIcon size={14} /> {TRUST_LEVEL[trust.level].label}
        </span>
      </div>

      {(trust.verifiedBusiness || !trust.newlyReviewed) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {trust.verifiedBusiness && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-800 dark:bg-violet-400/10 dark:text-violet-200">
              <BadgeCheck size={13} /> Registered business (CAC checked)
            </span>
          )}
          {!trust.newlyReviewed && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[12px] font-medium text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
              <Clock size={13} /> New - Nestly is reviewing this store
            </span>
          )}
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {trustFacts(trust).map((fact) => (
          <div key={fact.label} className="rounded-xl bg-surface-sunken px-3.5 py-3">
            <dd className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-ink">{fact.value}</dd>
            <dt className="mt-0.5 text-[11.5px] text-muted">{fact.label}</dt>
          </div>
        ))}
      </dl>

      <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-muted">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        Whatever the record, paying through Nestly keeps your money held until you receive your order.
      </p>
    </section>
  );
}
