"use client";

import { SellerRevenueByCategory } from "@/src/services/seller-dashboard.services";

interface Props {
  categories: SellerRevenueByCategory[];
  isLoading?: boolean;
}

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CategoryRevenueChart({ categories, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-[280px] animate-pulse rounded-2xl border border-line bg-surface-2" />;
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-2xl border border-line bg-surface text-[13.5px] text-subtle">
        No revenue yet.
      </div>
    );
  }

  const max = Math.max(...categories.map((c) => c.revenue));

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-[15px] font-semibold text-ink">Revenue by category</h3>

      <div className="mt-5 space-y-4">
        {categories.map((category) => {
          const pct = max > 0 ? Math.max(4, Math.round((category.revenue / max) * 100)) : 0;

          return (
            <div key={category.categoryId}>
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="truncate font-medium text-ink-2">
                  {category.categoryName}
                </span>
                <span className="shrink-0 font-[family-name:var(--font-mono)] text-[12.5px] font-semibold text-violet-700 dark:text-violet-300">
                  {formatNaira(category.revenue)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
