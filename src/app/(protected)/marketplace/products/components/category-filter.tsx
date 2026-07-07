"use client";

import { marketplaceCategories } from "@/src/mocks/marketplace";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {marketplaceCategories.map((category) => {
        const active = value === category;

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`
              whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors
              ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  : "border border-[#ECE9F6] bg-white text-[#475569] hover:border-violet-200"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}