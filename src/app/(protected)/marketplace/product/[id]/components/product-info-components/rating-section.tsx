"use client";

import { Star } from "lucide-react";
import { Product } from "@/src/types/product";

interface Props {
  product: Product;
}

export default function RatingSection({ product }: Props) {
  if (product.rating === undefined) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <Star size={16} className="fill-yellow-400 text-yellow-400" />
        <span className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-[#13131A]">
          {product.rating}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#94A3B8]">
          ({product.reviewCount ?? 0} reviews)
        </span>
      </div>
    </div>
  );
}
