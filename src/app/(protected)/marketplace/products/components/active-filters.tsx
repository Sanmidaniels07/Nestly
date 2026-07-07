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
    search && { key: "search", label: `"${search}"`, onClear: onClearSearch, tone: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
    category !== "All" && { key: "category", label: category, onClear: onClearCategory, tone: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" },
    sort !== "Newest" && { key: "sort", label: sort, onClear: onResetSort, tone: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
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