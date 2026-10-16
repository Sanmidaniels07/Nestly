"use client";

import { X } from "lucide-react";

interface ActiveFiltersProps {
  search: string;
  category: string;
  sort: string;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onResetSort: () => void;
}

export default function ActiveFilters({
  search,
  category,
  sort,
  onClearSearch,
  onClearCategory,
  onResetSort,
}: ActiveFiltersProps) {
  const chips = [
    search && { key: "search", label: `"${search}"`, onClear: onClearSearch, tone: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/15" },
    category !== "All" && { key: "category", label: category, onClear: onClearCategory, tone: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/15" },
    sort !== "Newest" && { key: "sort", label: sort, onClear: onResetSort, tone: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/15" },
  ].filter(Boolean) as { key: string; label: string; onClear: () => void; tone: string }[];

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onClear}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${chip.tone}`}
        >
          {chip.label}
          <X size={12} />
        </button>
      ))}
    </div>
  );
}