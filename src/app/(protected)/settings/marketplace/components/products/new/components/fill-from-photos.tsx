"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { AiListingDraft, createAiListingDraft, getAiListingStatus } from "@/src/services/ai-listing.services";
import { ApiErrorResponse } from "@/src/types/api";

const MAX_PHOTOS = 4;

interface Props {
  // Photos already uploaded on this step.
  photoUrls: string[];
  // The form already has a title or description - ask before replacing it.
  hasContent: boolean;
  onApply: (draft: AiListingDraft) => void;
}

// On the Photos step: once there's a photo, offer to write the listing from
// it (title, description, category, details, a price guide). Shows nothing
// while photo-to-listing is switched off on the server - the seller just
// carries on to the details, so the flow is the same either way.
export default function FillFromPhotos({ photoUrls, hasContent, onApply }: Props) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: status } = useQuery({ queryKey: ["ai-listing", "status"], queryFn: getAiListingStatus, staleTime: 60_000 });

  if (!status?.enabled || photoUrls.length === 0) return null;
  const outOfTries = status.remainingToday <= 0;

  const fill = async () => {
    if (hasContent && !window.confirm("Replace the details you've typed with the suggestion? You can still edit everything after.")) return;
    setBusy(true);
    try {
      const draft = await createAiListingDraft(photoUrls.slice(0, MAX_PHOTOS));
      onApply(draft);
      toast.success("Done! Check the details and change anything that isn't right.");
    } catch (error) {
      const message = (error as AxiosError<ApiErrorResponse>).response?.data?.message;
      toast.error(message ?? "Couldn't write the listing from these photos. Fill in the details instead.");
    } finally {
      setBusy(false);
      queryClient.invalidateQueries({ queryKey: ["ai-listing", "status"] });
    }
  };

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 p-[1.5px]">
      <div className="flex flex-col gap-3 rounded-[calc(1rem-1.5px)] bg-surface p-4 sm:flex-row sm:items-center">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <Sparkles size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">{busy ? "Writing your listing..." : "Let us fill in the details"}</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
            {busy
              ? "Looking at your photos - this takes a few seconds."
              : outOfTries
                ? "You've used today's tries - fill in the details yourself, or try again tomorrow."
                : `We'll write the title, description, category and details from your photos. You check everything before it goes live. ${status.remainingToday} left today.`}
          </p>
        </div>
        <button
          type="button"
          onClick={fill}
          disabled={busy || outOfTries}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-[14px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Sparkles size={16} aria-hidden />}
          {busy ? "Working..." : "Fill it in for me"}
        </button>
      </div>
    </div>
  );
}
