"use client";

import { useState } from "react";
import { MessageCircle, Star, Store } from "lucide-react";
import { Review } from "@/src/types/review";
import { AuthorAvatarLink, AuthorNameLink } from "@/src/components/social/author-link";
import { useReplyToReview } from "@/src/hooks/use-reply-to-review";
import { formatRelativeTime } from "@/src/lib/date";

interface Props {
  rating?: number;
  reviews: Review[];
  total: number;
  isOwner?: boolean;
}

export default function SellerReviews({ rating, reviews, total, isOwner }: Props) {
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
              <ReviewCard key={review.id} review={review} isOwner={!!isOwner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, isOwner }: { review: Review; isOwner: boolean }) {
  const { mutate: reply, isPending } = useReplyToReview();
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    reply({ id: review.id, reply: text.trim() }, { onSuccess: () => setReplying(false) });
  };

  return (
    <div className="rounded-xl border border-[#ECE9F6] p-4">
      <div className="flex gap-3.5">
        <AuthorAvatarLink author={review.user} size={44} />

        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-semibold text-[#13131A]">
            <AuthorNameLink author={review.user} />
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

          {review.reply && (
            <div className="mt-3 flex gap-2.5 rounded-xl bg-[#F8F8FC] p-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Store size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#13131A]">Seller response</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[#475569]">
                  {review.reply}
                </p>
              </div>
            </div>
          )}

          {isOwner && !review.reply && (
            <div className="mt-3">
              {replying ? (
                <div className="space-y-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={2}
                    placeholder="Write a public response..."
                    className="w-full resize-none rounded-xl border border-[#E4E6EB] px-3.5 py-2.5 text-[13px] text-[#13131A] outline-none focus:border-violet-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReplying(false)}
                      className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-[#64748B] hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!text.trim() || isPending}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                      {isPending ? "Posting..." : "Post reply"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplying(true)}
                  className="flex items-center gap-1.5 text-[12.5px] font-medium text-violet-600 hover:underline"
                >
                  <MessageCircle size={13} />
                  Reply as seller
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
