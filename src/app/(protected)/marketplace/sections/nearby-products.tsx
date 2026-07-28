"use client";

import { useFeaturedProducts } from "@/src/hooks/use-featured-products";
import ProductCard from "../components/product-card";
import SectionHeader from "../components/section-header";

export default function NearbyProducts() {
  const { data: products, isLoading } = useFeaturedProducts(8);

  if (!isLoading && !products?.length) return null;

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Featured products"
        subtitle="Handpicked for you"
        action={{
          label: "View all",
          href: "/marketplace/products",
        }}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl border border-[#EDEBF5] bg-[#F7F7FB]"
              />
            ))
          : products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
