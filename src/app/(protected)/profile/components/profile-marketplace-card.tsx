"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Package } from "lucide-react";

export interface MarketCardItem {
  id: string;
  title: string;
  image?: string;
  price: number;
  status: "ACTIVE" | "SOLD" | "PURCHASED";
  location?: string;
  meta?: string;
  href: string;
}

interface Props {
  item: MarketCardItem;
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  SOLD: "bg-[#F1F0F5] text-[#64748B]",
  PURCHASED: "bg-violet-50 text-violet-600",
};

export default function ProfileMarketCard({ item }: Props) {
  return (
    <Link
      href={item.href}
      className="block overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
    >
      <div className="relative h-44 w-full bg-[#F8F8FC]">
        {item.image ? (
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#C4C0DC]">
            <Package size={28} strokeWidth={1.5} />
          </div>
        )}

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

        {item.location && (
          <div className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
            <MapPin size={14} />
            {item.location}
          </div>
        )}

        {item.meta && (
          <p className="border-t border-[#F2F1F8] pt-3 font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
            {item.meta}
          </p>
        )}
      </div>
    </Link>
  );
}
