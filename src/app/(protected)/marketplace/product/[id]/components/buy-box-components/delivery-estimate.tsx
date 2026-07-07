"use client";

import { MapPin, Truck, Package } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function DeliveryEstimate({ product }: Props) {
  return (
    <div className="space-y-2.5 rounded-2xl border border-[#ECE9F6] p-4">
      {product.delivery && (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50">
            <Truck size={14} className="text-violet-600" />
          </div>
          <span className="text-[13.5px] text-[#334155]">Delivery available</span>
        </div>
      )}

      {product.pickup && (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <Package size={14} className="text-amber-600" />
          </div>
          <span className="text-[13.5px] text-[#334155]">Pickup available</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F0F5]">
          <MapPin size={14} className="text-[#64748B]" />
        </div>
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
          {product.seller.distance} away
        </span>
      </div>
    </div>
  );
}