"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { useSellerReturnRequests } from "@/src/hooks/use-seller-return-requests";
import { useRespondToReturn } from "@/src/hooks/use-return-actions";
import { ReturnRequest, SellerReturnAction } from "@/src/types/return-request";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";
import ReturnEvidence from "@/src/components/returns/return-evidence";
import { ReturnStatusPill, ReturnTrail } from "@/src/components/returns/return-status";

export default function ReturnsView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerReturnRequests({ page, limit: 10 });
  const returns = data?.returns ?? [];

  if (isLoading) {
    return <ListSkeleton count={4} withAvatar={false} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-surface-sunken px-4 py-3.5 text-[12.5px] leading-relaxed text-muted">
        When a buyer reports a problem, answer before the deadline (48 hours, 24 for food and other perishables):
        refund them, send a replacement, or tell us why you disagree and Nestly will decide. Your payout for that
        order waits until the report is closed.
      </div>

      {returns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <RotateCcw className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-subtle">No problem reports - nice work.</p>
        </div>
      ) : (
        returns.map((request) => <ReturnRequestCard key={request.id} request={request} />)
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  );
}

const ACTION_COPY: Record<SellerReturnAction, { title: string; hint: string; button: string; placeholder?: string; minNote?: number }> = {
  REFUND: {
    title: "Refund the buyer?",
    hint: "They get back what they paid for this item (and the delivery fee if it's the only thing they bought from you). It comes out of this order's payout. This can't be undone.",
    button: "Yes, refund",
  },
  REPLACE: {
    title: "Send a replacement",
    hint: "Arrange the replacement with the buyer. Your payout is released once they confirm it arrived (or after 7 days).",
    button: "Tell the buyer",
    placeholder: "When and how it will arrive (optional)",
  },
  DISAGREE: {
    title: "Tell Nestly why you disagree",
    hint: "Nestly reads both sides and decides within 2 business days.",
    button: "Send to Nestly",
    placeholder: "What happened? e.g. the item matched the photos and was checked before dispatch",
    minNote: 10,
  },
};

function ReturnRequestCard({ request }: { request: ReturnRequest }) {
  const { mutate: respond, isPending } = useRespondToReturn();
  const [action, setAction] = useState<SellerReturnAction | null>(null);
  const [note, setNote] = useState("");
  const answerable = request.status === "REQUESTED" || request.status === "APPROVED";
  const copy = action ? ACTION_COPY[action] : null;
  const noteTooShort = !!copy?.minNote && note.trim().length < copy.minNote;

  const submit = () => {
    if (!action || noteTooShort) return;
    respond({ id: request.id, action, note: note.trim() || undefined }, { onSuccess: () => setAction(null) });
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold text-ink">{request.orderItem?.product.title ?? "Order item"}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">{request.user?.name}</p>
          <ReturnEvidence request={request} />
          <p className="mt-1.5 text-[12px] text-subtle">Reported {formatRelativeTime(request.createdAt)}</p>
          <ReturnTrail request={request} viewer="seller" />
        </div>
        <ReturnStatusPill status={request.status} />
      </div>

      {answerable && !action && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line-soft pt-4">
          <button
            onClick={() => setAction("REFUND")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Refund buyer
          </button>
          <button
            onClick={() => setAction("REPLACE")}
            className="rounded-lg border border-line px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-violet-300"
          >
            Send a replacement
          </button>
          <button
            onClick={() => setAction("DISAGREE")}
            className="rounded-lg border border-line px-4 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:border-red-300 hover:text-red-600 dark:hover:text-red-400"
          >
            I disagree
          </button>
        </div>
      )}

      {answerable && copy && (
        <div className="mt-4 space-y-3 border-t border-line-soft pt-4">
          <div>
            <p className="text-[13.5px] font-semibold text-ink">{copy.title}</p>
            <p className="mt-0.5 text-[12.5px] text-muted">{copy.hint}</p>
          </div>
          {copy.placeholder && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder={copy.placeholder}
              className="w-full resize-none rounded-xl border border-line bg-surface-sunken px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-subtle focus:border-violet-400"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={submit}
              disabled={isPending || noteTooShort}
              className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              {isPending ? "Sending..." : copy.button}
            </button>
            <button
              onClick={() => {
                setAction(null);
                setNote("");
              }}
              className="rounded-lg px-4 py-2 text-[12.5px] font-medium text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
