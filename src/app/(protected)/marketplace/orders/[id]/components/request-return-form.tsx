"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useCreateReturnRequest } from "@/src/hooks/use-create-return-request";
import { uploadFiles } from "@/src/services/upload.services";
import { PERISHABLE_REPORT_HOURS, RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { ReturnReason } from "@/src/types/return-request";

interface Props {
  orderItemId: string;
  onDone: () => void;
  // "problem" is the not-received / something's-wrong path for items the
  // seller marked delivered but the buyer hasn't confirmed.
  mode?: "return" | "problem";
  /** Food, cakes, groceries: a photo is required and nothing is sent back. */
  perishable?: boolean;
}

const MAX_PHOTOS = 5;

// Nestly's returns policy: only these qualify - no change-of-mind returns.
const REASONS: { value: ReturnReason; label: string; perishableOnly?: boolean; problemOnly?: boolean }[] = [
  { value: "NOT_RECEIVED", label: "I didn't receive it", problemOnly: true },
  { value: "DAMAGED", label: "Arrived damaged" },
  { value: "SPOILED", label: "Spoiled or expired", perishableOnly: true },
  { value: "WRONG_ITEM", label: "Wrong item" },
  { value: "NOT_AS_DESCRIBED", label: "Not as described" },
  { value: "FAULTY", label: "Doesn't work" },
];

export default function RequestReturnForm({ orderItemId, onDone, mode = "return", perishable = false }: Props) {
  const [reasonType, setReasonType] = useState<ReturnReason | null>(null);
  const [reason, setReason] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate: createReturnRequest, isPending } = useCreateReturnRequest();

  const reasons = REASONS.filter(
    (option) => (!option.perishableOnly || perishable) && (!option.problemOnly || mode === "problem")
  );
  const needsPhoto = perishable && reasonType !== "NOT_RECEIVED";
  const canSubmit = !!reasonType && reason.trim().length >= 3 && (!needsPhoto || photos.length > 0) && !uploading;

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const chosen = Array.from(files).slice(0, MAX_PHOTOS - photos.length);
    setUploading(true);
    try {
      const { data } = await uploadFiles(chosen);
      setPhotos((current) =>
        [...current, ...data.filter((file) => file.type === "IMAGE").map((file) => file.url)].slice(0, MAX_PHOTOS)
      );
    } catch {
      toast.error("Couldn't upload the photo. Please try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!canSubmit || !reasonType) return;

    createReturnRequest(
      { orderItemId, reasonType, reason: reason.trim(), photos },
      {
        onSuccess: () => {
          // The order page shows the problem as reported (and pauses auto-confirm).
          queryClient.invalidateQueries({ queryKey: ["order"] });
          onDone();
        },
      }
    );
  };

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      <p className="text-[12.5px] leading-relaxed text-ink-2">
        {perishable
          ? `Food, cakes and groceries: report a problem within ${PERISHABLE_REPORT_HOURS} hours of delivery and add a photo - you don't need to send it back.`
          : `Report a problem within ${RETURN_WINDOW_DAYS} days of delivery.`}{" "}
        Returns for a change of mind aren&apos;t accepted.
      </p>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="What's wrong?">
        {reasons.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={reasonType === option.value}
            onClick={() => setReasonType(option.value)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              reasonType === option.value
                ? "border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
                : "border-line-strong bg-surface text-ink-2 hover:border-amber-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value.slice(0, 1000))}
        placeholder="Tell the seller what happened"
        rows={3}
        className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[16px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-amber-400 sm:text-[13.5px]"
      />

      <div>
        <div className="flex flex-wrap gap-2">
          {photos.map((url) => (
            <span key={url} className="relative h-16 w-16 overflow-hidden rounded-lg border border-line">
              <Image src={url} alt="Photo of the problem" fill sizes="64px" className="object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setPhotos((current) => current.filter((item) => item !== url))}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-line-strong bg-surface text-[10.5px] font-medium text-muted hover:border-amber-400 disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              {uploading ? "Uploading" : "Add photo"}
            </button>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
        <p className="mt-1.5 text-[11.5px] text-muted">
          {needsPhoto ? "A photo is required for food and other perishables." : "Photos help the seller sort it out faster (optional)."}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-muted">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          className="rounded-lg bg-amber-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : mode === "problem" ? "Report problem" : "Submit report"}
        </button>
      </div>
    </div>
  );
}
