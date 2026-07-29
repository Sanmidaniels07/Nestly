"use client";

import { useState } from "react";
import { Pencil, Star, Store, Trash2 } from "lucide-react";
import { Review } from "@/src/types/review";
import { AuthorAvatarLink, AuthorNameLink } from "@/src/components/social/author-link";
import StarRatingInput from "@/src/components/ui/star-rating-input";
import { formatRelativeTime } from "@/src/lib/date";
import { useAuthStore } from "@/src/store/auth-store";
import { useUpdateReview } from "@/src/hooks/use-update-review";
import { useDeleteReview } from "@/src/hooks/use-delete-review";

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isOwn = review.userId === currentUserId;

  const { mutate: updateReview, isPending: isSaving } = useUpdateReview(review.productId);
  const { mutate: deleteReview } = useDeleteReview(review.productId);

  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? "");

  const handleSave = () => {
    updateReview(
      { id: review.id, rating, comment: comment.trim() || undefined },
      { onSuccess: () => setEditing(false) }
    );
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] p-5">
      <div className="flex gap-3.5">
        <AuthorAvatarLink author={review.user} size={44} />

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="text-[14.5px] font-semibold text-[#13131A]">
                <AuthorNameLink author={review.user} />
              </h4>
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                {formatRelativeTime(review.createdAt)}
              </p>
            </div>

            {!editing && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {isOwn && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditing(true)}
                      aria-label="Edit review"
                      className="text-[#94A3B8] transition-colors hover:text-violet-600"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      aria-label="Delete review"
                      className="text-[#94A3B8] transition-colors hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {editing ? (
            <div className="mt-3 space-y-2.5">
              <StarRatingInput value={rating} onChange={setRating} size={18} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-[#E4E6EB] px-3.5 py-2.5 text-[13.5px] text-[#13131A] outline-none focus:border-violet-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-[#64748B] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            review.comment && (
              <p className="mt-3 text-[14px] leading-relaxed text-[#334155]">{review.comment}</p>
            )
          )}

          {!editing && review.reply && (
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
        </div>
      </div>
    </div>
  );
}
