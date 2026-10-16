"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateReturnRequest } from "@/src/hooks/use-create-return-request";

interface Props {
  orderItemId: string;
  onDone: () => void;
  // "problem" is the not-received / something's-wrong path for items the
  // seller marked delivered but the buyer hasn't confirmed.
  mode?: "return" | "problem";
}

const PROBLEM_REASONS = ["I didn't receive this item", "Item arrived damaged", "Wrong item delivered"];

export default function RequestReturnForm({ orderItemId, onDone, mode = "return" }: Props) {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { mutate: createReturnRequest, isPending } = useCreateReturnRequest();

  const handleSubmit = () => {
    if (reason.trim().length < 3) return;

    createReturnRequest(
      { orderItemId, reason: reason.trim() },
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
      {mode === "problem" && (
        <div className="flex flex-wrap gap-2">
          {PROBLEM_REASONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setReason(option)}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                reason === option
                  ? "border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
                  : "border-line-strong bg-surface text-ink-2 hover:border-amber-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={mode === "problem" ? "Tell the seller what happened" : "Why are you returning this item?"}
        rows={3}
        className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-amber-400"
      />

      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-muted">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={reason.trim().length < 3 || isPending}
          className="rounded-lg bg-amber-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : mode === "problem" ? "Report problem" : "Submit return request"}
        </button>
      </div>
    </div>
  );
}
