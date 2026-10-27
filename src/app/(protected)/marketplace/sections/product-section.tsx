"use client";

import ProductCard from "../components/product-card";
import SectionHeader from "../components/section-header";
import { Product } from "@/src/types/product";

interface Props<T extends Product> {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  products?: T[];
  isLoading?: boolean;
  // How many placeholders to show while loading.
  placeholders?: number;
  badge?: (product: T) => string | undefined;
}

// A titled grid of product cards. Hidden when there's nothing to show.
export default function ProductSection<T extends Product>({
  title,
  subtitle,
  action,
  products,
  isLoading,
  placeholders = 4,
  badge,
}: Props<T>) {
  if (!isLoading && !products?.length) return null;

  return (
    <section className="space-y-6">
      <SectionHeader title={title} subtitle={subtitle} action={action} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: placeholders }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl border border-line bg-surface-2"
              />
            ))
          : products?.map((product) => (
              <ProductCard key={product.id} product={product} badge={badge?.(product)} />
            ))}
      </div>
    </section>
  );
}
