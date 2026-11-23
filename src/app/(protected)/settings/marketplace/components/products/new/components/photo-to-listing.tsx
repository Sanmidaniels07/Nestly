"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Camera, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { uploadFiles } from "@/src/services/upload.services";
import { AiListingDraft, createAiListingDraft, getAiListingStatus } from "@/src/services/ai-listing.services";
import { ApiErrorResponse } from "@/src/types/api";

// "Start from a photo": the seller picks up to 4 product photos, we upload
// them and ask the API for a suggested title, description, category and
// details, then fill the form. Hidden when the feature is switched off.

const MAX_PHOTOS = 4;

interface Props {
  /** The form already has a title or description - ask before replacing it. */
  hasContent: boolean;
  onApply: (draft: AiListingDraft, photoUrls: string[]) => void;
}

export default function PhotoToListing({ hasContent, onApply }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<"idle" | "uploading" | "writing">("idle");

  const { data: status } = useQuery({
    queryKey: ["ai-listing", "status"],
    queryFn: getAiListingStatus,
    staleTime: 60_000,
  });

  if (!status?.enabled) return null;

  const busy = phase !== "idle";
  const outOfTries = status.remainingToday <= 0;

  const handleFiles = async (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));
    if (input.current) input.current.value = "";
    if (!files.length) return;
    if (files.length > MAX_PHOTOS) toast(`Using the first ${MAX_PHOTOS} photos.`);
    if (hasContent && !window.confirm("Replace what you've typed with the suggestion? You can still edit everything after.")) return;

    try {
      setPhase("uploading");
      const uploaded = await uploadFiles(files.slice(0, MAX_PHOTOS));
      const urls = uploaded.data.map((file) => file.url);
      setPhase("writing");
      const draft = await createAiListingDraft(urls);
      onApply(draft, urls);
      toast.success("Done! Check the details and edit anything that isn't right.");
    } catch (error) {
      const message = (error as AxiosError<ApiErrorResponse>).response?.data?.message;
      toast.error(message ?? "Couldn't write a listing from those photos. Fill in the form instead.");
    } finally {
      setPhase("idle");
      queryClient.invalidateQueries({ queryKey: ["ai-listing", "status"] });
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 p-[1.5px]">
      <div className="flex flex-col gap-4 rounded-[calc(1.5rem-1.5px)] bg-surface px-5 py-5 sm:flex-row sm:items-center">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <Sparkles size={20} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">Start from a photo</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
            {busy
              ? phase === "uploading"
                ? "Uploading your photos..."
                : "Looking at your photos and writing your listing..."
              : `Add up to ${MAX_PHOTOS} photos of your product and we'll fill in the title, description, category and details. You check everything before it goes live.`}
          </p>
          {!busy && (
            <p className="mt-1 text-[12px] text-subtle">
              {outOfTries ? "You've used today's tries - fill in the form, or try again tomorrow." : `${status.remainingToday} left today`}
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={busy || outOfTries}
          onClick={() => input.current?.click()}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-[14px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Camera size={16} aria-hidden />}
          {busy ? "Working..." : "Choose photos"}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </div>
  );
}
