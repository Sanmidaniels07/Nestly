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
              active ? "border-violet-300 bg-violet-50" : "border-[#ECE9F6] hover:border-violet-200"
            }`}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-[#E2E0EE]"}
                />
              ))}
            </div>
            <span className="text-[12.5px] text-[#64748B]">& up</span>
          </button>
        );
      })}
    </div>
  );
}