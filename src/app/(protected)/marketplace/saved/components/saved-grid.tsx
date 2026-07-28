"use client";

import { useMemo } from "react";
import ProductCard from "@/src/app/(protected)/marketplace/components/product-card";
import { useWishlist } from "@/src/hooks/use-wishlist";
import EmptySaved from "./empty-saved";

interface Props {
  search: string;
}

export default function SavedGrid({ search }: Props) {
  const { data: wishlist, isLoading } = useWishlist();
  const items = wishlist ?? [];

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const value = search.toLowerCase();
    return items.filter(
      (item) =>
        item.product.title.toLowerCase().includes(value) ||
        item.product.brand?.toLowerCase().includes(value)
    );
  }, [items, search]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white py-16 text-center text-[13.5px] text-[#94A3B8]">
        Loading saved products...
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptySaved />;
  }

  if (filteredItems.length === 0) {
    return <EmptySaved variant="no-results" query={search} />;
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {filteredItems.map((item) => (
        <ProductCard key={item.id} product={item.product} />
      ))}
    </section>
  );
}
