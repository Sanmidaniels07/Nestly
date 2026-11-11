"use client";

import { useState } from "react";
import { Gavel } from "lucide-react";

import { useAdminReturnRequests, useDecideReturn } from "@/src/hooks/use-return-actions";
import { formatRelativeTime } from "@/src/lib/date";
import Pagination from "@/src/components/ui/pagination";
import ReturnEvidence from "@/src/components/returns/return-evidence";
import { ReturnStatusPill, ReturnTrail } from "@/src/components/returns/return-status";
import { ReturnDecision, ReturnRequest } from "@/src/types/return-request";

/**
 * Problem reports for Nestly: disputes to decide (seller disagreed, didn't
 * answer in time, or the replacement had a problem), other open reports
 * (Nestly can step in), and refunds that have to be sent by hand.
 */
export default function ReturnsManager() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReturnRequests({ page, limit: 15 });
  const returns = data?.returns ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[12.5px] text-muted">
        Disputes first. Refunding sends the buyer what they paid for the item (plus delivery if nothing else from that
        seller was kept) and takes it out of the seller&apos;s held payout. Closing it releases the seller&apos;s payout.
      </p>

      {returns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <Gavel className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-subtle">Nothing waiting on Nestly.</p>
        </div>
      ) : (
        returns.map((request) => <AdminReturnCard key={request.id} request={request} />)
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  );
}

function AdminReturnCard({ request }: { request: ReturnRequest }) {
  const { mutate: decide, isPending } = useDecideReturn();
  const [decision, setDecision] = useState<ReturnDecision | null>(null);
  const [note, setNote] = useState("");
  const open = ["REQUESTED", "APPROVED", "REPLACEMENT", "DISPUTED"].includes(request.status);
  const manualRefund = request.status === "REFUNDED" && request.refundStatus === "FAILED";

  return (
    <div className={`rounded-2xl border bg-surface p-5 ${request.status === "DISPUTED" ? "border-violet-300 dark:border-violet-500/40" : "border-line"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold text-ink">{request.orderItem?.product.title ?? "Order item"}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {request.user?.name} ({request.user?.email}) · seller {request.orderItem?.product.store?.name ?? "-"}
          </p>
          <ReturnEvidence request={request} />
          <p className="mt-1.5 text-[12px] text-subtle">
            Reported {formatRelativeTime(request.createdAt)}
            {request.escalatedAt ? ` · with Nestly since ${formatRelativeTime(request.escalatedAt)}` : ""}
            {request.order?.paymentReference ? ` · Paystack ref ${request.order.paymentReference}` : ""}
          </p>
          <ReturnTrail request={request} viewer="admin" />
        </div>
        <ReturnStatusPill status={request.status} />
      </div>

      {manualRefund && (
        <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-700 dark:bg-red-500/10 dark:text-red-300">
          Refund this in the Paystack dashboard (Transactions → the reference above → Refund). The seller was paid
          through a split, so recover it from them if needed.
        </p>
      )}

      {open && !decision && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line-soft pt-4">
          <button
            onClick={() => setDecision("REFUND")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-emerald-700"
          >
            Refund buyer
          </button>
          <button
            onClick={() => setDecision("REJECT")}
            className="rounded-lg border border-line px-4 py-2 text-[12.5px] font-semibold text-ink hover:border-violet-300"
          >
            Close in seller&apos;s favour
          </button>
        </div>
      )}

      {open && decision && (
        <div className="mt-4 space-y-3 border-t border-line-soft pt-4">
          <p className="text-[13px] font-semibold text-ink">
            {decision === "REFUND" ? "Refund the buyer" : "Close in the seller's favour"} - note for both (optional)
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={1000}
            placeholder={decision === "REFUND" ? "e.g. The photos show the item arrived damaged." : "e.g. The item matches the listing photos."}
            className="w-full resize-none rounded-xl border border-line bg-surface-sunken px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-subtle focus:border-violet-400"
          />
          <div className="flex gap-2">
            <button
              onClick={() => decide({ id: request.id, decision, note: note.trim() || undefined }, { onSuccess: () => setDecision(null) })}
              disabled={isPending}
              className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Confirm"}
            </button>
            <button onClick={() => setDecision(null)} className="rounded-lg px-4 py-2 text-[12.5px] font-medium text-muted hover:text-ink">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
