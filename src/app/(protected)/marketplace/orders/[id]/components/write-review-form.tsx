"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";

import { useCreateReview } from "@/src/hooks/use-create-review";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import StarRatingInput from "@/src/components/ui/star-rating-input";
import { useFormDraft } from "@/src/hooks/use-form-draft";
import DraftRestoredNotice from "@/src/components/ui/draft-restored-notice";

const MAX_PHOTOS = 4;

interface Props {
  orderId: string;
  productId: string;
  onDone: () => void;
}

// A review of something that was delivered - stars, a few words and, if
// they like, photos of what arrived. Reviews with photos stand out in the
// shopping feed, so the form invites them.
export default function WriteReviewForm({ orderId, productId, onDone }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: createReview, isPending } = useCreateReview();
  const { mutateAsync: uploadImage } = useImageUpload();

  // The review in progress (stars, words, uploaded photos) is kept in this
  // browser, so reopening the form after a refresh brings it back.
  const { restored, clear: clearSaved, dismissNotice } = useFormDraft(
    `review:${orderId}:${productId}`,
    { rating, comment, images },
    (saved) => {
      setRating(saved.rating ?? 0);
      setComment(saved.comment ?? "");
      setImages(saved.images ?? []);
    },
    { isEmpty: (value) => value.rating === 0 && !value.comment.trim() && value.images.length === 0 }
  );

  const startOver = () => {
    setRating(0);
    setComment("");
    setImages([]);
    clearSaved();
  };

  const cancel = () => {
    clearSaved();
    onDone();
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const picked = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - images.length);
    setUploading(picked.length);
    for (const file of picked) {
      try {
        const url = await uploadImage(file);
        setImages((current) => [...current, url].slice(0, MAX_PHOTOS));
      } catch {
        // useImageUpload already showed an error.
      }
      setUploading((count) => count - 1);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    createReview(
      { productId, rating, comment: comment.trim() || undefined, images: images.length ? images : undefined },
      {
        onSuccess: () => {
          clearSaved();
          onDone();
        },
      }
    );
  };

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-dashed border-violet-200 bg-surface-sunken p-4 dark:border-violet-500/30">
      {restored && <DraftRestoredNotice what="the review you started" onStartOver={startOver} onDismiss={dismissNotice} />}
      <StarRatingInput value={rating} onChange={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was it? Your friends see this in their feed."
        rows={3}
        className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400"
      />

      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="relative h-16 w-16 overflow-hidden rounded-lg border border-line">
            <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            <button
              type="button"
              onClick={() => setImages((current) => current.filter((u) => u !== url))}
              aria-label="Remove photo"
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        {Array.from({ length: uploading }).map((_, i) => (
          <div key={`up-${i}`} className="flex h-16 w-16 items-center justify-center rounded-lg border border-line bg-surface">
            <Loader2 size={16} className="animate-spin text-violet-600" />
          </div>
        ))}
        {images.length + uploading < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-16 items-center gap-1.5 rounded-lg border-2 border-dashed border-violet-200 px-3 text-[12px] font-semibold text-violet-700 hover:border-violet-400 dark:border-violet-500/30 dark:text-violet-300"
          >
            <Camera size={15} /> {images.length ? "Add" : "Add photos"}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          hidden
          onChange={(e) => {
            addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={cancel} className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-muted">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isPending || uploading > 0}
          className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </div>
  );
}
