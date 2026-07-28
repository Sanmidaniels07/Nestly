"use client";

import { useMemo, useState } from "react";
import { Product } from "@/src/types/product";
import { Review } from "@/src/types/review";

import ReviewFilter, { ReviewFilterValue } from "./product-review-components/review-filter";
import RatingOverview from "./product-review-components/rating-overview";
import RatingBreakdown from "./product-review-components/rating-breakdown";
import ReviewCard from "./product-review-components/review-card";

interface Props {
  product: Product;
  reviews: Review[];
  total: number;
}

export default function ProductReviews({ product, reviews, total }: Props) {
  const [filter, setFilter] = useState<ReviewFilterValue>("all");

  const breakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      value: reviews.filter((r) => r.rating === stars).length,
    }));
  }, [reviews]);

  const counts: Record<ReviewFilterValue, number> = useMemo(
    () => ({
      all: reviews.length,
      "5": reviews.filter((r) => r.rating === 5).length,
      "4": reviews.filter((r) => r.rating === 4).length,
      "3": reviews.filter((r) => r.rating === 3).length,
      "2": reviews.filter((r) => r.rating === 2).length,
      "1": reviews.filter((r) => r.rating === 1).length,
    }),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter((r) => r.rating === Number(filter));
  }, [reviews, filter]);

  if (total === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        Customer reviews
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div>
          <RatingOverview rating={product.rating ?? 0} reviews={total} />
          <div className="mt-6">
            <RatingBreakdown
              breakdown={breakdown}
              total={reviews.length}
              activeStars={filter === "all" ? null : Number(filter)}
              onSelectStars={(stars) => setFilter(stars === null ? "all" : (String(stars) as ReviewFilterValue))}
            />
          </div>
        </div>

        <div>
          <ReviewFilter active={filter} onChange={setFilter} counts={counts} />

          <div className="mt-6 space-y-4">
            {filteredReviews.length === 0 ? (
              <p className="py-8 text-center text-[13.5px] text-[#94A3B8]">
                No reviews match this filter.
              </p>
            ) : (
              filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
