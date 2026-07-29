"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { useSellerReturnRequests } from "@/src/hooks/use-seller-return-requests";
import { useUpdateReturnRequestStatus } from "@/src/hooks/use-update-return-request-status";
import { ReturnRequest } from "@/src/types/return-request";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

const statusTone: Record<string, string> = {
  REQUESTED: "bg-amber-50 text-amber-700",
  APPROVED: "bg-blue-50 text-blue-700",
  REJECTED: "bg-red-50 text-red-700",
  REFUNDED: "bg-emerald-50 text-emerald-700",
};

export default function ReturnsView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerReturnRequests({ page, limit: 10 });
  const returns = data?.returns ?? [];

  if (isLoading) {
    return <ListSkeleton count={4} withAvatar={false} />;
  }

  if (returns.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
        <RotateCcw className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
        <p className="mt-4 text-[13.5px] text-[#94A3B8]">No return requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {returns.map((request) => (
        <ReturnRequestCard key={request.id} request={request} />
      ))}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function ReturnRequestCard({ request }: { request: ReturnRequest }) {
  const { mutate: updateStatus, isPending } = useUpdateReturnRequestStatus();

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[14.5px] font-semibold text-[#13131A]">
            {request.orderItem?.product.title ?? "Order item"}
          </p>
          <p className="mt-0.5 text-[12.5px] text-[#64748B]">
            {request.user?.name} · {request.user?.email}
          </p>
          <p className="mt-2 text-[13px] text-[#334155]">{request.reason}</p>
          <p className="mt-1.5 text-[12px] text-[#94A3B8]">
            Requested {formatRelativeTime(request.createdAt)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${
            statusTone[request.status] ?? "bg-[#F1F0F5] text-[#64748B]"
          }`}
        >
          {request.status.toLowerCase()}
        </span>
      </div>

      {request.status === "REQUESTED" && (
        <div className="mt-4 flex gap-2 border-t border-[#F2F1F8] pt-4">
          <button
            onClick={() => updateStatus({ id: request.id, status: "APPROVED" })}
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => updateStatus({ id: request.id, status: "REJECTED" })}
            disabled={isPending}
            className="rounded-lg border border-red-200 px-4 py-2 text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {request.status === "APPROVED" && (
        <div className="mt-4 border-t border-[#F2F1F8] pt-4">
          <button
            onClick={() => updateStatus({ id: request.id, status: "REFUNDED" })}
            disabled={isPending}
            className="rounded-lg bg-violet-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
          >
            Mark as refunded
          </button>
        </div>
      )}
    </div>
  );
}
