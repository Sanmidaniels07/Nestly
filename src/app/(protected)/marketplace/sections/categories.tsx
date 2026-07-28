"use client";

import SectionHeader from "../components/section-header";
import CategoryCard from "../components/category-card";
import { useFeaturedCategories } from "@/src/hooks/use-featured-categories";

export default function CategoriesSection() {
  const { data: categories, isLoading } = useFeaturedCategories(8);

  if (!isLoading && !categories?.length) return null;

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Browse Categories"
        subtitle="Marketplace"
        action={{
          label: "View all",
          href: "/marketplace/categories",
        }}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[164px] animate-pulse rounded-2xl border border-[#EDEBF5] bg-[#F7F7FB]"
              />
            ))
          : categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
      </div>
    </section>
  );
}
