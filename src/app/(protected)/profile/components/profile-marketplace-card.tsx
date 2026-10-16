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
  ACTIVE: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  SOLD: "bg-surface-muted text-muted",
  PURCHASED: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export default function ProfileMarketCard({ item }: Props) {
  return (
    <Link
      href={item.href}
      className="block overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
    >
      <div className="relative h-44 w-full bg-surface-sunken">
        {item.image ? (
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-faint">
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
          <h3 className="truncate text-[15px] font-semibold text-ink">
            {item.title}
          </h3>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[19px] font-semibold text-violet-700 dark:text-violet-300">
            ₦{item.price.toLocaleString()}
          </p>
        </div>

        {item.location && (
          <div className="flex items-center gap-1.5 text-[13px] text-muted">
            <MapPin size={14} />
            {item.location}
          </div>
        )}

        {item.meta && (
          <p className="border-t border-line-soft pt-3 font-[family-name:var(--font-mono)] text-[12.5px] text-subtle">
            {item.meta}
          </p>
        )}
      </div>
    </Link>
  );
}
