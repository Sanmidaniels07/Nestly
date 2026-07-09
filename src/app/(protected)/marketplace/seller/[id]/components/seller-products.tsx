"use client";

import { useMemo, useState } from "react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";
import ProductCard from "@/src/app/(protected)/marketplace/components/product-card";

interface Props {
  products: MarketplaceProduct[];
}

const sortOptions = ["Newest", "Price low", "Price high", "Highest rated"];

export default function SellerProducts({ products }: Props) {
  const [sort, setSort] = useState("Newest");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "Price low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "Price high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "Highest rated":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [products, sort]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-5 border-b border-dashed border-[#ECE9F6] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Store products
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Products
          </h2>
          <p className="mt-1.5 text-[13px] text-[#64748B]">
            {products.length} product{products.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 rounded-xl border border-[#ECE9F6] bg-white px-4 text-[13px] font-medium text-[#334155] outline-none transition-colors focus:border-violet-400"
        >
          {sortOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] py-16 text-center">
          <p className="text-[13.5px] text-[#94A3B8]">This store has no products yet.</p>
        </div>
      )}
    </section>
  );
}