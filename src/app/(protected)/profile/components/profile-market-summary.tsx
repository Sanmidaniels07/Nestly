"use client";

import { Store, ShoppingBag, PackageCheck, Star } from "lucide-react";

const stats = [
  { title: "Active listings", value: "12", icon: Store, chip: "bg-violet-50 text-violet-600" },
  { title: "Sold items", value: "48", icon: PackageCheck, chip: "bg-emerald-50 text-emerald-600" },
  { title: "Purchases", value: "15", icon: ShoppingBag, chip: "bg-amber-50 text-amber-600" },
  { title: "Seller rating", value: "4.9", icon: Star, chip: "bg-rose-50 text-rose-600" },
];

export default function ProfileMarketSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
        >
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.chip}`}>
            <item.icon size={17} />
          </div>

          <h2 className="mt-4 font-[family-name:var(--font-mono)] text-[24px] font-semibold text-[#13131A]">
            {item.value}
          </h2>

          <p className="mt-0.5 text-[12.5px] font-medium text-[#94A3B8]">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}