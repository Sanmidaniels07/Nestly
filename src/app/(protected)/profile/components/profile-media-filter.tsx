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
                  : "border border-line bg-surface text-muted hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-600 dark:hover:text-violet-400"
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