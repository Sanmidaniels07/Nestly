"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useGoBack } from "@/src/hooks/use-go-back";

import { useReturnRequests } from "@/src/hooks/use-return-requests";
import { useBuyerReturnAction } from "@/src/hooks/use-return-actions";
import { formatRelativeTime } from "@/src/lib/date";
import Pagination from "@/src/components/ui/pagination";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";
import ReturnEvidence from "@/src/components/returns/return-evidence";
import { ReturnStatusPill, ReturnTrail } from "@/src/components/returns/return-status";
import { ReturnRequest } from "@/src/types/return-request";

export default function MyReturnsPage() {
  // Back to wherever the user came from; /marketplace/orders if they landed here directly.
  const goBack = useGoBack("/marketplace/orders");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReturnRequests({ page, limit: 10 });
  const returns = data?.returns ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <button
          type="button"
          onClick={() => goBack()}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[30px] italic text-ink sm:text-[34px]">
          My returns
        </h1>
        <p className="mt-0.5 text-[13.5px] text-muted">
          Problems you&apos;ve reported. The seller answers first; if you can&apos;t agree, Nestly decides.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={4} withAvatar={false} />
      ) : returns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-8 py-16 text-center">
          <RotateCcw className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-ink">No reports yet</p>
          <p className="mt-1 text-[14px] text-muted">
            If something arrives damaged, wrong or not as described, report it from the order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((request) => (
            <BuyerReturnCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  );
}

function BuyerReturnCard({ request }: { request: ReturnRequest }) {
  const { mutate: act, isPending } = useBuyerReturnAction();
  const [reportingProblem, setReportingProblem] = useState(false);
  const [note, setNote] = useState("");

  const canKeep = ["REQUESTED", "APPROVED", "DISPUTED"].includes(request.status);
  const awaitingReplacement = request.status === "REPLACEMENT";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold text-ink">{request.orderItem?.product.title ?? "Order item"}</p>
          {request.orderItem?.product.store?.name && (
            <p className="mt-0.5 text-[12.5px] text-muted">from {request.orderItem.product.store.name}</p>
          )}
          <ReturnEvidence request={request} />
          <p className="mt-1.5 text-[12px] text-subtle">Reported {formatRelativeTime(request.createdAt)}</p>
          <ReturnTrail request={request} viewer="buyer" />
        </div>
        <ReturnStatusPill status={request.status} />
      </div>

      {awaitingReplacement && !reportingProblem && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line-soft pt-4">
          <button
            onClick={() => act({ id: request.id, action: "REPLACEMENT_RECEIVED" })}
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            Got the replacement
          </button>
          <button
            onClick={() => setReportingProblem(true)}
            className="rounded-lg border border-line px-4 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:border-red-300 hover:text-red-600 dark:hover:text-red-400"
          >
            Problem with the replacement
          </button>
        </div>
      )}

      {awaitingReplacement && reportingProblem && (
        <div className="mt-4 space-y-3 border-t border-line-soft pt-4">
          <p className="text-[13px] text-muted">Tell us what&apos;s wrong - Nestly will decide.</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="e.g. it hasn't arrived, or it has the same problem"
            className="w-full resize-none rounded-xl border border-line bg-surface-sunken px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-subtle focus:border-violet-400"
          />
          <div className="flex gap-2">
            <button
              onClick={() => act({ id: request.id, action: "REPLACEMENT_PROBLEM", note: note.trim() }, { onSuccess: () => setReportingProblem(false) })}
              disabled={isPending || note.trim().length < 3}
              className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              Send to Nestly
            </button>
            <button onClick={() => setReportingProblem(false)} className="rounded-lg px-4 py-2 text-[12.5px] font-medium text-muted hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}

      {canKeep && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-4">
          <p className="text-[12.5px] text-subtle">Sorted it out with the seller, or decided it&apos;s fine?</p>
          <button
            onClick={() => act({ id: request.id, action: "KEEP" })}
            disabled={isPending}
            className="rounded-lg border border-line px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-violet-300 disabled:opacity-50"
          >
            Keep the item and close
          </button>
        </div>
      )}
    </div>
  );
}
