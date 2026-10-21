"use client";

import SectionHeader from "../components/section-header";
import CategoryCard from "../components/category-card";
import { useFeaturedCategories } from "@/src/hooks/use-featured-categories";

export default function CategoriesSection() {
  const { data: categories, isLoading } = useFeaturedCategories(8);

  if (!isLoading && !categories?.length) return null;

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Browse categories"
        subtitle="Marketplace"
        action={{
          label: "View all",
          href: "/marketplace/categories",
        }}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[148px] animate-pulse rounded-2xl border border-line bg-surface-2"
              />
            ))
          : categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
      </div>
    </section>
  );
}
