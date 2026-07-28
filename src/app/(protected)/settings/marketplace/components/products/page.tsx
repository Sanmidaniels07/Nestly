"use client";

import { useState } from "react";
import ProductsHeader from "./components/products-header";
import ProductsToolbar from "./components/products-toolbar";
import ProductsTable from "./components/products-table";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { ProductStatus } from "@/src/types/product";

const statusMap: Record<string, ProductStatus | undefined> = {
  "All status": undefined,
  Published: "PUBLISHED",
  Draft: "DRAFT",
  Archived: "ARCHIVED",
};

const sortMap: Record<string, "newest" | "oldest" | "price_asc" | "price_desc"> = {
  Newest: "newest",
  Oldest: "oldest",
  "Price ↑": "price_asc",
  "Price ↓": "price_desc",
};

export default function SellerProductsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All status");
  const [sort, setSort] = useState("Newest");

  const { data, isLoading, isError } = useMyProducts({
    status: statusMap[status],
    limit: 50,
  });

  const products = (data?.products ?? [])
    .filter((product) =>
      search.trim()
        ? product.title.toLowerCase().includes(search.trim().toLowerCase())
        : true
    )
    .sort((a, b) => {
      const key = sortMap[sort];
      if (key === "price_asc") return a.price - b.price;
      if (key === "price_desc") return b.price - a.price;
      if (key === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      <ProductsHeader />

      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {isLoading && (
        <p className="text-[13px] text-[#94A3B8]">Loading products...</p>
      )}

      {isError && (
        <p className="text-[13px] text-red-500">
          Couldn&apos;t load your products. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {products.length > 0 && (
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          )}

          <ProductsTable products={products} />
        </>
      )}
    </div>
  );
}
