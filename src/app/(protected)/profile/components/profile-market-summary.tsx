"use client";

import { Store, ShoppingBag, PackageCheck, Star } from "lucide-react";

interface Props {
  activeCount: number;
  soldCount: number;
  purchaseCount: number;
  rating?: number;
}

export default function ProfileMarketSummary({
  activeCount,
  soldCount,
  purchaseCount,
  rating,
}: Props) {
  const stats = [
    { title: "Active listings", value: activeCount.toString(), icon: Store, chip: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: "Sold items", value: soldCount.toString(), icon: PackageCheck, chip: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Purchases", value: purchaseCount.toString(), icon: ShoppingBag, chip: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { title: "Seller rating", value: rating !== undefined ? rating.toFixed(1) : "—", icon: Star, chip: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.chip}`}>
            <item.icon size={17} />
          </div>

          <h2 className="mt-4 font-[family-name:var(--font-mono)] text-[24px] font-semibold text-ink">
            {item.value}
          </h2>

          <p className="mt-0.5 text-[12.5px] font-medium text-subtle">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}
