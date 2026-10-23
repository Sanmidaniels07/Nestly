"use client";

import { Star, Package, CalendarDays } from "lucide-react";
import { Store } from "@/src/types/store";

interface Props {
  store: Store;
  productCount: number;
}

export default function SellerStats({ store, productCount }: Props) {
  const memberSince = new Date(store.createdAt).getFullYear();

  const stats = [
    {
      icon: Star,
      title: "Rating",
      value: store.rating !== undefined ? store.rating : "New",
      subtitle:
        store.reviewCount !== undefined ? `${store.reviewCount} reviews` : "No reviews yet",
    },
    {
      icon: Package,
      title: "Products",
      value: productCount,
      subtitle: "Active listings",
    },
    {
      icon: CalendarDays,
      title: "Member since",
      value: memberSince,
      subtitle: "On Nestly",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <Icon size={18} className="text-violet-600 dark:text-violet-400" />
            </div>

            <h3 className="mt-4 text-[12.5px] text-muted">{stat.title}</h3>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[22px] font-semibold text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-[12px] text-subtle">{stat.subtitle}</p>
          </div>
        );
      })}
    </section>
  );
}
