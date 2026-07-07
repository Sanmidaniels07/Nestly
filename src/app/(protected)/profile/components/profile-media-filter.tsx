"use client";

const filters = ["All", "Photos", "Videos"] as const;

type Filter = (typeof filters)[number];

interface Props {
  value: Filter;
  onChange: (value: Filter) => void;
}

export default function ProfileMediaFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => {
        const active = value === filter;

        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`
              rounded-full px-4 py-2 text-[13px] font-semibold
              transition-colors
              ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  : "border border-[#ECE9F6] bg-white text-[#64748B] hover:border-violet-200 hover:text-violet-600"
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}