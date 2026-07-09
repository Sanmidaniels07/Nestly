"use client";

import { Star, Package, Users, Clock3, TrendingUp, CalendarDays } from "lucide-react";
import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerStats({ seller }: Props) {
  const stats = [
    {
      icon: Star,
      title: "Rating",
      value: seller.rating,
      subtitle: `${seller.reviews} reviews`,
    },
    {
      icon: Package,
      title: "Products",
      value: seller.productsCount,
      subtitle: "Active listings",
    },
    {
      icon: Users,
      title: "Followers",
      value: seller.followers.toLocaleString(),
      subtitle: "People following",
    },
    {
      icon: TrendingUp,
      title: "Response rate",
      value: `${seller.responseRate}%`,
      subtitle: "Usually replies",
    },
    {
      icon: Clock3,
      title: "Response time",
      value: seller.responseTime,
      subtitle: "Average reply",
    },
    {
      icon: CalendarDays,
      title: "Member since",
      value: seller.joined,
      subtitle: "Trusted seller",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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