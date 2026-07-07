"use client";

import { Package, Truck, MapPinned, ShieldCheck } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function AvailabilityBadges({ product }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700">
        <Package size={13} />
        <span className="font-[family-name:var(--font-mono)]">{product.stock}</span> in stock
      </span>

      {product.delivery && (
        <span className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[13px] font-medium text-violet-700">
          <Truck size={13} />
          Delivery available
        </span>
      )}

      {product.pickup && (
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-medium text-amber-700">
          <MapPinned size={13} />
          Pickup available
        </span>
      )}

      <span className="flex items-center gap-1.5 rounded-full bg-[#F1F0F5] px-3 py-1.5 text-[13px] font-medium text-[#334155]">
        <ShieldCheck size={13} />
        {product.warranty}
      </span>
    </div>
  );
}