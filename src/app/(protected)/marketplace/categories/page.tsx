"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useCategories } from "@/src/hooks/use-categories";
import CategoryCard from "../components/category-card";

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <div className="space-y-4">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-violet-600 hover:underline"
        >
          <ArrowLeft size={15} />
          Back to marketplace
        </Link>

        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600">
            Marketplace
          </p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[36px] italic text-[#13131A] sm:text-[42px]">
            All categories
          </h1>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[164px] animate-pulse rounded-2xl border border-[#EDEBF5] bg-[#F7F7FB]"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-[#ECE9F6] bg-white py-16 text-center text-[13.5px] text-red-500">
          Couldn&apos;t load categories. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
