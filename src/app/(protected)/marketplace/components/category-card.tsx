"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/src/types/category";
import { getCategoryIcon, getCategoryTone } from "@/src/lib/category-style";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  const Icon = getCategoryIcon(category);
  const tone = getCategoryTone(category);
  const count = category.productCount;

  return (
    <Link
      href={`/marketplace/products?category=${category.slug}`}
      className={`group relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(76,29,149,0.45)] sm:p-6 ${tone.card}`}
    >
      {/* Oversized faded icon for depth */}
      <Icon
        aria-hidden
        strokeWidth={1.4}
        className={`pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${tone.ghost}`}
      />

      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[0_10px_22px_-10px_rgba(76,29,149,0.6)] ${tone.tile}`}>
          {category.icon ? (
            <span className="text-[22px] leading-none">{category.icon}</span>
          ) : (
            <Icon size={22} strokeWidth={2} />
          )}
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/70 text-muted opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-white/5">
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="relative mt-5">
        <h3 className="text-[15.5px] font-semibold leading-snug text-ink">{category.name}</h3>
        {count !== undefined && (
          <p className={`mt-1 font-[family-name:var(--font-mono)] text-[12px] font-medium ${count > 0 ? tone.text : "text-subtle"}`}>
            {count > 0 ? `${count.toLocaleString()} ${count === 1 ? "item" : "items"}` : "New · be the first"}
          </p>
        )}
      </div>
    </Link>
  );
}
