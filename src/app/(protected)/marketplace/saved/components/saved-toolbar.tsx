"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  view?: "grid" | "list";
  onViewChange?: (view: "grid" | "list") => void;
}

export default function SavedToolbar({ search, onSearchChange, view, onViewChange }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search saved products..."
            icon={<Search size={16} />}
          />
        </div>

        {onViewChange && (
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-[#ECE9F6] p-1">
            <button
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                view === "grid" ? "bg-violet-50 text-violet-600" : "text-[#94A3B8] hover:bg-[#F7F7FB]"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewChange("list")}
              aria-label="List view"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                view === "list" ? "bg-violet-50 text-violet-600" : "text-[#94A3B8] hover:bg-[#F7F7FB]"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}