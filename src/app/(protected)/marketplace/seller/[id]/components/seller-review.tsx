"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Star, ThumbsUp } from "lucide-react";
import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerReviews({ seller }: Props) {
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
              {seller.rating}
            </p>

            <div className="mt-2.5 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={15} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="mt-3 font-[family-name:var(--font-mono)] text-[12.5px] text-[#64748B]">
              Based on {seller.reviews} reviews
            </p>
          </div>

          <div className="flex-1 space-y-4">
            {seller.reviewsData.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ review }: { review: MarketplaceSeller["reviewsData"][number] }) {
  const [marked, setMarked] = useState(false);
  const [count, setCount] = useState(review.helpful);

  const toggleHelpful = () => {
    setMarked((prev) => !prev);
    setCount((prev) => (marked ? prev - 1 : prev + 1));
  };

  return (
    <div className="rounded-xl border border-[#ECE9F6] p-4">
      <div className="flex gap-3.5">
        <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px]">
          <div className="rounded-full bg-white p-[2px]">
            <Image
              src={review.customer.avatar}
              alt={review.customer.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[14px] font-semibold text-[#13131A]">{review.customer.name}</h4>

            {review.verifiedBuyer && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <BadgeCheck size={11} />
                Verified buyer
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-2.5">
            <div className="flex gap-0.5">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} size={12} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
              {review.date}
            </span>
          </div>

          <p className="mt-2 text-[12.5px] font-medium text-violet-600">
            Purchased: {review.purchasedProduct}
          </p>

          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#475569]">
            {review.comment}
          </p>

          <button
            onClick={toggleHelpful}
            className={`mt-3 flex items-center gap-1.5 text-[12.5px] font-medium transition-colors ${
              marked ? "text-violet-600" : "text-[#64748B] hover:text-violet-600"
            }`}
          >
            <ThumbsUp size={13} fill={marked ? "currentColor" : "none"} />
            Helpful
            <span className="font-[family-name:var(--font-mono)]">({count})</span>
          </button>
        </div>
      </div>
    </div>
  );
}