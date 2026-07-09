"use client";

import { useMemo } from "react";
import ProductCard from "@/src/app/(protected)/marketplace/components/product-card";
import { useSavedStore } from "@/src/store/saved-store";
import EmptySaved from "./empty-saved";

interface Props {
  search: string;
}

export default function SavedGrid({ search }: Props) {
  const items = useSavedStore((state) => state.items);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const value = search.toLowerCase();
    return items.filter(
      (product) =>
        product.name.toLowerCase().includes(value) || product.brand.toLowerCase().includes(value)
    );
  }, [items, search]);

  if (items.length === 0) {
    return <EmptySaved />;
  }

  if (filteredItems.length === 0) {
    return <EmptySaved variant="no-results" query={search} />;
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {filteredItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}