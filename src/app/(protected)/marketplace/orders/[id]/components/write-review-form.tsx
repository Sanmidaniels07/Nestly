"use client";

import { useState } from "react";
import { useCreateReview } from "@/src/hooks/use-create-review";
import StarRatingInput from "@/src/components/ui/star-rating-input";

interface Props {
  productId: string;
  onDone: () => void;
}

export default function WriteReviewForm({ productId, onDone }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) return;

    createReview(
      { productId, rating, comment: comment.trim() || undefined },
      { onSuccess: onDone }
    );
  };

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-dashed border-violet-200 dark:border-violet-500/30 bg-surface-sunken p-4">
      <StarRatingInput value={rating} onChange={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product (optional)"
        rows={3}
        className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onDone}
          className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isPending}
          className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </div>
  );
}
