"use client";

import { Star } from "lucide-react";

interface Props {
  rating: number;
  reviews: number;
}

export default function RatingOverview({ rating, reviews }: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <h2 className="font-[family-name:var(--font-mono)] text-[42px] font-bold leading-none text-[#13131A]">
          {rating}
        </h2>
        <Star size={24} className="fill-yellow-400 text-yellow-400" />
      </div>
      <p className="font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
        Based on {reviews} reviews
      </p>
    </div>
  );
}