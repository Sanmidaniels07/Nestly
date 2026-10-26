"use client";

import { Info, Wallet } from "lucide-react";

import { useCategories } from "@/src/hooks/use-categories";

interface Props {
  /** Price as typed in the form (string) - may be empty or invalid. */
  price: string | number;
  categoryId: string;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

// Shows the seller, before they publish, what Nestly takes and what they keep.
// Rates come from the category; the rate at checkout is locked onto each order.
export default function EarningsPreview({ price, categoryId }: Props) {
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.id === categoryId);
  const amount = Number(price);
  const hasPrice = Number.isFinite(amount) && amount > 0;

  if (!category) {
    return (
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-dashed border-line bg-surface-sunken px-4 py-3 text-[12.5px] text-muted">
        <Info size={15} className="mt-px shrink-0" />
        Choose a category to see Nestly&apos;s commission and what you&apos;ll receive.
      </div>
    );
  }

  const commission = hasPrice ? Math.round((amount * category.commissionRate) / 100) : 0;
  const receive = hasPrice ? amount - commission : 0;

  return (
    <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3.5 dark:border-violet-500/20 dark:bg-violet-500/[0.07]">
      <div className="flex items-start gap-2.5">
        <Wallet size={16} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
        <div className="min-w-0 text-[13px] leading-relaxed">
          <p className="text-ink-2">
            <span className="font-semibold text-ink">{category.name}</span> · {category.commissionRate}% Nestly commission
          </p>
          {hasPrice ? (
            <p className="mt-0.5 text-ink-2">
              On a sale at {money(amount)}, you receive{" "}
              <span className="font-[family-name:var(--font-mono)] font-semibold text-violet-700 dark:text-violet-300">{money(receive)}</span>
              <span className="text-muted"> (commission {money(commission)}).</span>
            </p>
          ) : (
            <p className="mt-0.5 text-muted">Enter a price to see what you&apos;ll receive.</p>
          )}
          <p className="mt-1.5 text-[12px] text-muted">
            Delivery fees are yours in full (no commission). Nestly pays Paystack&apos;s processing fee.
          </p>
        </div>
      </div>
    </div>
  );
}
