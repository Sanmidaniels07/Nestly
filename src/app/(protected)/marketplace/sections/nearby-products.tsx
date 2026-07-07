"use client";

import { nearbyProducts } from "@/src/mocks/marketplace";
import ProductCard from "../components/product-card";
import SectionHeader from "../components/section-header";

export default function NearbyProducts() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Nearby products"
        subtitle="Around you"
        action={{
          label: "View all",
          href: "/marketplace/products",
        }}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {nearbyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
