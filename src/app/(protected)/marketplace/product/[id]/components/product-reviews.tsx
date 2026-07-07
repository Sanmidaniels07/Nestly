"use client";

import { useMemo, useState } from "react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

import ReviewFilter, { ReviewFilterValue } from "./product-review-components/review-filter";
import RatingOverview from "./product-review-components/rating-overview";
import RatingBreakdown from "./product-review-components/rating-breakdown";
import ReviewCard from "./product-review-components/review-card";
interface Props {
  product: MarketplaceProduct;
}

export default function ProductReviews({ product }: Props) {
  const [filter, setFilter] = useState<ReviewFilterValue>("all");
  const [activeStars, setActiveStars] = useState<number | null>(null);

  const breakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      value: product.reviewsData.filter((r) => r.rating === stars).length,
    }));
  }, [product.reviewsData]);

  const counts: Record<ReviewFilterValue, number> = useMemo(
    () => ({
      all: product.reviewsData.length,
      "5": product.reviewsData.filter((r) => r.rating === 5).length,
      "4": product.reviewsData.filter((r) => r.rating === 4).length,
      "3": product.reviewsData.filter((r) => r.rating === 3).length,
      images: product.reviewsData.filter((r) => r.images && r.images.length > 0).length,
    }),
    [product.reviewsData]
  );

  const filteredReviews = useMemo(() => {
    let result = product.reviewsData;

    if (activeStars !== null) {
      result = result.filter((r) => r.rating === activeStars);
    } else if (filter === "images") {
      result = result.filter((r) => r.images && r.images.length > 0);
    } else if (filter !== "all") {
      result = result.filter((r) => r.rating === Number(filter));
    }

    return result;
  }, [product.reviewsData, filter, activeStars]);

  const handleFilterChange = (value: ReviewFilterValue) => {
    setFilter(value);
    setActiveStars(null);
  };

  const handleStarsSelect = (stars: number | null) => {
    setActiveStars(stars);
    setFilter("all");
  };

  return (
    <section className="mt-8 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#13131A]">
        Customer reviews
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div>
          <RatingOverview rating={product.rating} reviews={product.reviews} />
          <div className="mt-6">
            <RatingBreakdown
              breakdown={breakdown}
              total={product.reviewsData.length}
              activeStars={activeStars}
              onSelectStars={handleStarsSelect}
            />
          </div>
        </div>

        <div>
          <ReviewFilter active={filter} onChange={handleFilterChange} counts={counts} />

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