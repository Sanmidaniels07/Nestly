"use client";

import { BadgeCheck, Star } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function RatingSection({ product }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <Star size={16} className="fill-yellow-400 text-yellow-400" />
        <span className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-[#13131A]">
          {product.rating}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#94A3B8]">
          ({product.reviews} reviews)
        </span>
      </div>

      {product.seller.verified && (
        <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[12.5px] font-medium text-blue-600">
          <BadgeCheck size={13} />
          Verified seller
        </div>
      )}
    </div>
  );
}