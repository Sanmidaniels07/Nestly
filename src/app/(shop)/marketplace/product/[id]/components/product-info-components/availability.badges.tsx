"use client";

import { Package } from "lucide-react";
import { Product } from "@/src/types/product";

interface Props {
  product: Product;
}

export default function AvailabilityBadges({ product }: Props) {
  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${
          outOfStock ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        }`}
      >
        <Package size={13} />
        {outOfStock ? (
          "Out of stock"
        ) : (
          <>
            <span className="font-[family-name:var(--font-mono)]">{product.stock}</span> in stock
          </>
        )}
      </span>
    </div>
  );
}
