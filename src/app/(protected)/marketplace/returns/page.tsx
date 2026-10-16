"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { useReturnRequests } from "@/src/hooks/use-return-requests";
import { formatRelativeTime } from "@/src/lib/date";
import Pagination from "@/src/components/ui/pagination";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

const statusTone: Record<string, string> = {
  REQUESTED: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  REJECTED: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
  REFUNDED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
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
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400"
        >
          <ArrowLeft size={15} />
          Back to orders
        </Link>

        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[30px] italic text-ink sm:text-[34px]">
          My returns
        </h1>
        <p className="mt-0.5 text-[13.5px] text-muted">
          Track the status of your return requests.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={4} withAvatar={false} />
      ) : returns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-8 py-16 text-center">
          <RotateCcw className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-ink">No return requests yet</p>
          <p className="mt-1 text-[14px] text-muted">
            Requests you submit from a delivered order will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">
                    {request.orderItem?.product.title ?? "Order item"}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{request.reason}</p>
                  <p className="mt-1.5 text-[12px] text-subtle">
                    Requested {formatRelativeTime(request.createdAt)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${
                    statusTone[request.status] ?? "bg-surface-muted text-muted"
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
