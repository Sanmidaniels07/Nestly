"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
}

const statusOptions = ["All", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
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
            placeholder="Search orders..."
            icon={<Search size={16} />}
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-12 rounded-xl border border-[#ECE9F6] bg-white px-4 text-[13.5px] text-[#13131A] outline-none transition-colors focus:border-violet-400"
        >
          {statusOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="relative flex h-12 items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] px-5 text-[13.5px] font-medium text-[#334155] transition-colors hover:bg-[#F8F7FC]"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {(search || status !== "All") && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[12.5px] font-medium text-violet-700 transition-colors hover:bg-violet-100"
            >
              "{search}"
              <X size={12} />
            </button>
          )}

          {status !== "All" && (
            <button
              onClick={() => onStatusChange("All")}
              className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-[12.5px] font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              {status}
              <X size={12} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}