"use client";

import { sellerProducts } from "@/src/mocks/seller-products";
import TopProductCard from "./top-product-card";

export default function TopSellingProducts() {
  const topProducts = sellerProducts.slice(0, 3);

  return (
    <section className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Best sellers
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          Top selling products
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {topProducts.map((product, index) => (
          <TopProductCard
            key={product.id}
            product={product}
            sold={product.totalSold}
            position={index + 1}
          />
        ))}
      </div>
    </section>
  );
}