"use client";

import { MapPin, Store } from "lucide-react";
import { Product } from "@/src/types/product";

interface Props {
  product: Product;
}

export default function DeliveryEstimate({ product }: Props) {
  const location = [product.store?.city, product.store?.state]
    .filter(Boolean)
    .join(", ");

  if (!product.store) return null;

  return (
    <div className="space-y-2.5 rounded-2xl border border-[#ECE9F6] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Store size={14} className="text-violet-600" />
        </div>
        <span className="text-[13.5px] text-[#334155]">
          Sold by {product.store.name}
        </span>
      </div>

      {location && (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F0F5]">
            <MapPin size={14} className="text-[#64748B]" />
          </div>
          <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
            {location}
          </span>
        </div>
      )}
    </div>
  );
}
