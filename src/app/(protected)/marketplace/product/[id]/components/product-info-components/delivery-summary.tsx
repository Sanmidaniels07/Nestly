"use client";

import { MapPin } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function DeliverySummary({ product }: Props) {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-[#FAFAFD] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <MapPin size={16} className="text-violet-600" />
        </div>

        <div>
          <p className="text-[13.5px] font-medium text-[#13131A]">Seller location</p>
          <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-[#64748B]">
            {product.seller.distance} away
          </p>
        </div>
      </div>
    </div>
  );
}