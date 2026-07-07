"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  value: string;
  onChange: (brand: string) => void;
}

const brands = ["All", "Apple", "Samsung", "Sony", "Canon", "Dell", "HP"];

export default function BrandFilter({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#ECE9F6] bg-white px-3.5 pr-9 text-[13.5px] text-[#13131A] outline-none transition-colors focus:border-violet-400"
      >
        {brands.map((brand) => (
          <option key={brand}>{brand}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
    </div>
  );
}