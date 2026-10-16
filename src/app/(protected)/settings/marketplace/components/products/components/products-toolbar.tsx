"use client";

import { Search, ChevronDown } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-line bg-surface px-4 pr-9 text-[13.5px] text-ink outline-none transition-colors focus:border-violet-400"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle"
      />
    </div>
  );
}

export default function ProductsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="grid gap-3 xl:grid-cols-[1fr_170px_170px]">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          icon={<Search size={16} />}
        />

        <Select
          value={status}
          onChange={onStatusChange}
          options={["All status", "Published", "Draft", "Archived"]}
        />

        <Select
          value={sort}
          onChange={onSortChange}
          options={["Newest", "Oldest", "Price ↑", "Price ↓"]}
        />
      </div>
    </section>
  );
}
