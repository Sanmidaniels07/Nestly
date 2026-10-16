"use client";

interface Props {
  breakdown: { stars: number; value: number }[];
  total: number;
  activeStars: number | null;
  onSelectStars: (stars: number | null) => void;
}

export default function RatingBreakdown({ breakdown, total, activeStars, onSelectStars }: Props) {
  return (
    <div className="space-y-2.5">
      {breakdown.map((item) => {
        const width = total > 0 ? (item.value / total) * 100 : 0;
        const active = activeStars === item.stars;

        return (
          <button
            key={item.stars}
            onClick={() => onSelectStars(active ? null : item.stars)}
            className={`flex w-full items-center gap-3 rounded-lg px-1.5 py-1 transition-colors ${
              active ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-surface-2"
            }`}
          >
            <span className="w-8 font-[family-name:var(--font-mono)] text-[12.5px] text-muted">
              {item.stars}★
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-track">
              <div
                style={{ width: `${width}%` }}
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
              />
            </div>
            <span className="w-8 text-right font-[family-name:var(--font-mono)] text-[12px] text-subtle">
              {item.value}
            </span>
          </button>
        );
      })}
    </div>
  );
}