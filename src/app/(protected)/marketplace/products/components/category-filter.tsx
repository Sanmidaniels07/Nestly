"use client";

import { useCategories } from "@/src/hooks/use-categories";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  const { data: categories } = useCategories();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange("All")}
        className={`
          whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors
          ${
            value === "All"
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
              : "border border-[#ECE9F6] bg-white text-[#475569] hover:border-violet-200"
          }
        `}
      >
        All
      </button>

      {categories?.map((category) => {
        const active = value === category.slug;

        return (
          <button
            key={category.id}
            onClick={() => onChange(category.slug)}
            className={`
              whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors
              ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  : "border border-[#ECE9F6] bg-white text-[#475569] hover:border-violet-200"
              }
            `}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
