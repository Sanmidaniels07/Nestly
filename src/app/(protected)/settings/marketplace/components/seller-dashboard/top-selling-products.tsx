"use client";

import TopProductCard from "./top-product-card";
import { useSellerTopProducts } from "@/src/hooks/use-seller-top-products";

export default function TopSellingProducts() {
  const { data: topProducts, isLoading } = useSellerTopProducts(3);

  if (!isLoading && !topProducts?.length) return null;

  return (
    <section className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Best sellers
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
          Top selling products
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[190px] animate-pulse rounded-2xl border border-line bg-surface-2" />
            ))
          : topProducts?.map((entry, index) => (
              <TopProductCard
                key={entry.product.id}
                product={entry.product}
                sold={entry.unitsSold}
                revenue={entry.revenue}
                position={index + 1}
              />
            ))}
      </div>
    </section>
  );
}
