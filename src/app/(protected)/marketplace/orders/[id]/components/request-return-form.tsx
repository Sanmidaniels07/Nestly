"use client";

import { useState } from "react";
import { useCreateReturnRequest } from "@/src/hooks/use-create-return-request";

interface Props {
  orderItemId: string;
  onDone: () => void;
}

export default function RequestReturnForm({ orderItemId, onDone }: Props) {
  const [reason, setReason] = useState("");
  const { mutate: createReturnRequest, isPending } = useCreateReturnRequest();

  const handleSubmit = () => {
    if (reason.trim().length < 3) return;

    createReturnRequest({ orderItemId, reason: reason.trim() }, { onSuccess: onDone });
  };

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-4">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why are you returning this item?"
        rows={3}
        className="w-full resize-none rounded-xl border border-[#E4E6EB] bg-white px-3.5 py-2.5 text-[13.5px] text-[#13131A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-amber-400"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onDone}
          className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-[#64748B] hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={reason.trim().length < 3 || isPending}
          className="rounded-lg bg-amber-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit return request"}
        </button>
      </div>
    </div>
  );
}
