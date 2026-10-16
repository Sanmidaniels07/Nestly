"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import CategoryFilter from "./category-filter";
import Input from "@/src/components/ui/input";

interface ProductsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onOpenFilters: () => void;
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ProductsToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  onOpenFilters,
}: ProductsToolbarProps) {
  return (
    <section className="space-y-5 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            icon={<Search size={16} />}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-12 rounded-xl border border-line bg-surface px-4 text-[13.5px] text-ink outline-none transition-colors focus:border-violet-400"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onOpenFilters}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-surface-sunken"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <CategoryFilter value={category} onChange={onCategoryChange} />
    </section>
  );
}
