"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { useReturnRequests } from "@/src/hooks/use-return-requests";
import { formatRelativeTime } from "@/src/lib/date";
import Pagination from "@/src/components/ui/pagination";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

const statusTone: Record<string, string> = {
  REQUESTED: "bg-amber-50 text-amber-700",
  APPROVED: "bg-blue-50 text-blue-700",
  REJECTED: "bg-red-50 text-red-700",
  REFUNDED: "bg-emerald-50 text-emerald-700",
};

export default function MyReturnsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReturnRequests({ page, limit: 10 });
  const returns = data?.returns ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <Link
          href="/marketplace/orders"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-violet-600"
        >
          <ArrowLeft size={15} />
          Back to orders
        </Link>

        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[30px] italic text-[#13131A] sm:text-[34px]">
          My returns
        </h1>
        <p className="mt-0.5 text-[13.5px] text-[#64748B]">
          Track the status of your return requests.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={4} withAvatar={false} />
      ) : returns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <RotateCcw className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">No return requests yet</p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Requests you submit from a delivered order will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-[#ECE9F6] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[14.5px] font-semibold text-[#13131A]">
                    {request.orderItem?.product.title ?? "Order item"}
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748B]">{request.reason}</p>
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
            </div>
          ))}
        </div>
      )}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
