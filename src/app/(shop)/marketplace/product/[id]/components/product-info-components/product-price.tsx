"use client";

import { Product } from "@/src/types/product";

interface Props {
  product: Product;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PriceSection({ product }: Props) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined;

  return (
    <div className="flex flex-wrap items-end gap-2.5">
      <h2 className="font-[family-name:var(--font-mono)] text-[30px] font-bold text-violet-700 dark:text-violet-300">
        {money(product.price)}
      </h2>

      {product.originalPrice && (
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-subtle line-through">
          {money(product.originalPrice)}
        </span>
      )}

      {discount !== undefined && (
        <span className="rounded-full bg-red-50 dark:bg-red-500/10 px-2.5 py-1 text-[11.5px] font-semibold text-red-600 dark:text-red-400">
          {discount}% OFF
        </span>
      )}
    </div>
  );
}
