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
            className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-colors hover:border-violet-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <Icon size={18} className="text-violet-600" />
            </div>

            <h3 className="mt-4 text-[12.5px] text-[#64748B]">{stat.title}</h3>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[22px] font-semibold text-[#13131A]">
              {stat.value}
            </p>
            <p className="mt-1 text-[12px] text-[#94A3B8]">{stat.subtitle}</p>
          </div>
        );
      })}
    </section>
  );
}
