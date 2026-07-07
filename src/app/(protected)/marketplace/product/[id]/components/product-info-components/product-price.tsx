"use client";

import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PriceSection({ product }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-2.5">
      <h2 className="font-[family-name:var(--font-mono)] text-[30px] font-bold text-violet-700">
        {money(product.price)}
      </h2>

      {product.originalPrice && (
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-[#94A3B8] line-through">
          {money(product.originalPrice)}
        </span>
      )}

      {product.discount && (
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11.5px] font-semibold text-red-600">
          {product.discount}% OFF
        </span>
      )}
    </div>
  );
}