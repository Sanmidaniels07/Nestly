"use client";

import { useMemo, useState } from "react";
import ProductsHeader from "./components/products-header";
import ProductsToolbar from "./components/products-toolbar";
import ProductsTable from "./components/products-table";
import { sellerProducts } from "@/src/mocks/seller-products";

export default function SellerProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All status");
  const [sort, setSort] = useState("Newest");

  const filteredProducts = useMemo(() => {
    let products = [...sellerProducts];

    if (category !== "All categories") {
      products = products.filter((p) => p.category === category);
    }

    if (status === "Active") {
      products = products.filter((p) => p.active);
    } else if (status === "Inactive") {
      products = products.filter((p) => !p.active);
    }

    if (search.trim()) {
      const value = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(value) || p.brand.toLowerCase().includes(value)
      );
    }

    switch (sort) {
      case "Price ↑":
        products.sort((a, b) => a.price - b.price);
        break;
      case "Price ↓":
        products.sort((a, b) => b.price - a.price);
        break;
      case "Most sold":
        products.sort((a, b) => b.totalSold - a.totalSold);
        break;
      case "Oldest":
        products.reverse();
        break;
      default:
        break;
    }

    return products;
  }, [search, category, status, sort]);

  return (
    <div className="space-y-6">
      <ProductsHeader />

      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {filteredProducts.length > 0 && (
        <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      )}

      <ProductsTable products={filteredProducts} />
    </div>
  );
}