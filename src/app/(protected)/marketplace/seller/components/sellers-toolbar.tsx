"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
}

const sortOptions = ["Recommended", "Highest Rated", "Most Followers", "Nearest"];

export default function SellersToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  onOpenFilters,
  activeFilterCount = 0,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sellers..."
            icon={<Search size={16} />}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-12 rounded-xl border border-[#ECE9F6] bg-white px-4 text-[13.5px] text-[#13131A] outline-none transition-colors focus:border-violet-400"
        >
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="relative flex h-12 items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] px-5 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>
    </section>
  );
}