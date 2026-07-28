"use client";

import { Star } from "lucide-react";
import { Review } from "@/src/types/review";
import UserAvatar from "@/src/components/ui/user-avatar";
import { formatRelativeTime } from "@/src/lib/date";

interface Props {
  rating?: number;
  reviews: Review[];
  total: number;
}

export default function SellerReviews({ rating, reviews, total }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Customer reviews
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
          What buyers say
        </h2>
      </div>

      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-56">
            <p className="font-[family-name:var(--font-mono)] text-[44px] font-bold leading-none text-violet-700">
              {rating ?? "—"}
            </p>

            <div className="mt-2.5 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  className={
                    rating && index < Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-[#E5E7EB]"
                  }
                />
              ))}
            </div>

            <p className="mt-3 font-[family-name:var(--font-mono)] text-[12.5px] text-[#64748B]">
              Based on {total} review{total !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex-1 space-y-4">
            {reviews.length === 0 && (
              <p className="text-[13.5px] text-[#94A3B8]">No reviews yet.</p>
            )}

            {reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-[#ECE9F6] p-4">
                <div className="flex gap-3.5">
                  <UserAvatar name={review.user?.name} size={44} />

                  <div className="min-w-0 flex-1">
                    <h4 className="text-[14px] font-semibold text-[#13131A]">
                      {review.user?.name ?? "Unknown buyer"}
                    </h4>

                    <div className="mt-1.5 flex items-center gap-2.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <Star key={index} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>

                    {review.productTitle && (
                      <p className="mt-2 text-[12.5px] font-medium text-violet-600">
                        Purchased: {review.productTitle}
                      </p>
                    )}

                    {review.comment && (
                      <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#475569]">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
