"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp } from "lucide-react";
import { ProductReview } from "@/src/mocks/marketplace";

interface Props {
  review: ProductReview;
}

export default function ReviewCard({ review }: Props) {
  const [marked, setMarked] = useState(false);
  const [count, setCount] = useState(review.helpful);

  const toggleHelpful = () => {
    setMarked((prev) => !prev);
    setCount((prev) => (marked ? prev - 1 : prev + 1));
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] p-5">
      <div className="flex gap-3.5">
        <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px]">
          <div className="rounded-full bg-white p-[2px]">
            <Image
              src={review.user.avatar}
              width={44}
              height={44}
              alt={review.user.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="text-[14.5px] font-semibold text-[#13131A]">{review.user.name}</h4>
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                {review.createdAt}
              </p>
            </div>

            <div className="flex">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          <p className="mt-3 text-[14px] leading-relaxed text-[#334155]">{review.comment}</p>

          {review.images && review.images.length > 0 && (
            <div className="mt-4 flex gap-2">
              {review.images.map((image) => (
                <div key={image} className="overflow-hidden rounded-lg">
                  <Image src={image} width={72} height={72} alt="" className="h-[72px] w-[72px] object-cover" />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={toggleHelpful}
            className={`mt-4 flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
              marked ? "text-violet-600" : "text-[#64748B] hover:text-violet-600"
            }`}
          >
            <ThumbsUp size={14} fill={marked ? "currentColor" : "none"} />
            Helpful
            <span className="font-[family-name:var(--font-mono)]">({count})</span>
          </button>
        </div>
      </div>
    </div>
  );
}