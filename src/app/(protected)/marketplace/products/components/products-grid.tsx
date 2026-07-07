"use client";

import ProductCard from "../../components/product-card";
import { MarketplaceProduct } from "@/src/mocks/marketplace";
import ProductsEmpty from "./products-empty-state";

interface Props {
  products: MarketplaceProduct[];
}

export default function ProductsGrid({ products }: Props) {
  if (!products.length) {
    return <ProductsEmpty />;
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}