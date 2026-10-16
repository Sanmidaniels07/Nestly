"use client";

export type ReviewFilterValue = "all" | "5" | "4" | "3" | "2" | "1";

interface Props {
  active: ReviewFilterValue;
  onChange: (value: ReviewFilterValue) => void;
  counts: Record<ReviewFilterValue, number>;
}

const filters: { label: string; value: ReviewFilterValue }[] = [
  { label: "All", value: "all" },
  { label: "5★", value: "5" },
  { label: "4★", value: "4" },
  { label: "3★", value: "3" },
  { label: "2★", value: "2" },
  { label: "1★", value: "1" },
];

export default function ReviewFilter({ active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = active === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`
              rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors
              ${isActive ? "bg-violet-600 text-white" : "bg-surface-2 text-muted hover:bg-surface-muted"}
            `}
          >
            {filter.label}
            {counts[filter.value] > 0 && (
              <span
                className={`ml-1.5 font-[family-name:var(--font-mono)] text-[11.5px] ${
                  isActive ? "text-white/70" : "text-subtle"
                }`}
              >
                {counts[filter.value]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
