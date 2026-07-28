"use client";

import { useFeaturedProducts } from "@/src/hooks/use-featured-products";
import ProductCard from "../../components/product-card";

export default function CartRecentlyViewed() {
  const { data: products } = useFeaturedProducts(3);

  if (!products?.length) return null;

  return (
    <section className="space-y-5">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        You might also like
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}
