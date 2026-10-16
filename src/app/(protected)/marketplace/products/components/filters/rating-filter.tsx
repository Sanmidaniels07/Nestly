"use client";

import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange: (rating: number) => void;
}

const ratings = [5, 4, 3, 2, 1];

export default function RatingFilter({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      {ratings.map((rating) => {
        const active = value === rating;

        return (
          <button
            key={rating}
            onClick={() => onChange(active ? 0 : rating)}
            className={`flex w-full items-center justify-between rounded-xl border p-3 transition-colors ${
              active ? "border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10" : "border-line hover:border-violet-200 dark:hover:border-violet-500/30"
            }`}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-faint"}
                />
              ))}
            </div>
            <span className="text-[12.5px] text-muted">& up</span>
          </button>
        );
      })}
    </div>
  );
}