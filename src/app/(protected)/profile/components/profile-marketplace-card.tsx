"use client";

import Image from "next/image";
import { Eye, Heart, MapPin } from "lucide-react";
import { MarketplaceItem } from "@/src/mocks/profile-marketplace";

interface Props {
  item: MarketplaceItem;
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  SOLD: "bg-[#F1F0F5] text-[#64748B]",
  PURCHASED: "bg-violet-50 text-violet-600",
};

function formatCount(value: number) {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function ProfileMarketCard({ item }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]">
      <div className="relative">
        <Image
          src={item.image}
          alt={item.title}
          width={600}
          height={450}
          className="h-44 w-full object-cover"
        />

        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[item.status] ?? statusStyles.ACTIVE}`}
        >
          {item.status}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="truncate text-[15px] font-semibold text-[#13131A]">
            {item.title}
          </h3>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[19px] font-semibold text-violet-700">
            ₦{item.price.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
          <MapPin size={14} />
          {item.location}
        </div>

        <div className="flex items-center gap-4 border-t border-[#F2F1F8] pt-3 text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <Eye size={15} />
            <span className="font-[family-name:var(--font-mono)] text-[12.5px]">
              {formatCount(item.views)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart size={15} />
            <span className="font-[family-name:var(--font-mono)] text-[12.5px]">
              {formatCount(item.likes)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}