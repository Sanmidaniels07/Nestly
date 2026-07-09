"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
  sold: number;
  position: number;
}

const rankStyles: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-400 to-yellow-500 text-white",
  2: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  3: "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
};

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TopProductCard({ product, sold, position }: Props) {
  const revenue = product.price * sold;

  return (
    <Link
      href={`/marketplace/product/${product.id}`}
      className="group relative overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]"
    >
      <div className="flex items-start justify-between">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F8F8FC]">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        </div>

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full font-[family-name:var(--font-mono)] text-[12px] font-bold ${
            rankStyles[position] ?? "bg-[#F1F0F5] text-[#64748B]"
          }`}
        >
          {position}
        </div>
      </div>

      <h3 className="mt-4 truncate text-[14.5px] font-semibold text-[#13131A]">
        {product.name}
      </h3>
      <p className="mt-0.5 text-[12.5px] text-[#94A3B8]">{product.brand}</p>

      <div className="mt-4 flex items-center justify-between border-t border-[#F2F1F8] pt-3.5">
        <div>
          <p className="text-[11px] text-[#94A3B8]">Sold</p>
          <p className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[#13131A]">
            {sold}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-[#94A3B8]">Revenue</p>
          <p className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-violet-700">
            {formatNaira(revenue)}
          </p>
        </div>
      </div>

      {position === 1 && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-amber-700">
          <TrendingUp size={10} />
          Best seller
        </div>
      )}
    </Link>
  );
}