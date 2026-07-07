"use client";

import { nearbyProducts } from "@/src/mocks/marketplace";

import ProductCard from "../../components/product-card";

export default function CartRecentlyViewed() {
  return (
    <section className="space-y-5">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        Recently viewed
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {nearbyProducts.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}