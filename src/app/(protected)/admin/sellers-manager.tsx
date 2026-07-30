"use client";

import { useState } from "react";
import { BadgeCheck, Store as StoreIcon } from "lucide-react";

import { useAdminSellers } from "@/src/hooks/use-admin-sellers";
import { useUpdateSellerStatus } from "@/src/hooks/use-update-seller-status";
import { AdminSeller } from "@/src/types/admin-seller";
import { SellerApplicationStatus } from "@/src/types/seller";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";

const STATUS_TONE: Record<SellerApplicationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

const STATUS_FILTERS: { label: string; value?: SellerApplicationStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "All", value: undefined },
];

export default function SellersManager() {
  const [status, setStatus] = useState<SellerApplicationStatus | undefined>("PENDING");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminSellers({ status, page, limit: 15 });
  const sellers = data?.sellers ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              status === filter.value
                ? "bg-violet-600 text-white"
                : "border border-[#E5E7EB] text-[#64748B] hover:border-violet-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <StoreIcon className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-[#94A3B8]">No seller applications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sellers.map((seller) => (
            <SellerRow key={seller.id} seller={seller} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function SellerRow({ seller }: { seller: AdminSeller }) {
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();

  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirmReject = () => {
    if (!reason.trim()) return;
    updateStatus(
      { id: seller.id, data: { status: "REJECTED", reason: reason.trim() } },
      { onSuccess: () => setRejecting(false) }
    );
    setReason("");
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-[#13131A]">{seller.user.name}</p>
            {seller.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
          </div>
          <p className="mt-0.5 text-[12.5px] text-[#64748B]">
            {seller.user.email}
            {seller.user.username && ` · @${seller.user.username}`}
          </p>
          {seller.cacNumber && (
            <p className="mt-1 text-[12px] text-[#94A3B8]">CAC: {seller.cacNumber}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11.5px] text-[#94A3B8]">
            Applied {formatRelativeTime(seller.createdAt)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[seller.status]}`}
          >
            {seller.status.toLowerCase()}
          </span>
        </div>
      </div>

      {seller.statusReason && seller.status === "REJECTED" && (
        <p className="mt-2 rounded-lg bg-[#FAFAFD] px-3 py-2 text-[12px] text-[#64748B]">
          Reason: {seller.statusReason}
        </p>
      )}

      {seller.status !== "APPROVED" && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#F2F1F8] pt-3.5">
          <button
            onClick={() => updateStatus({ id: seller.id, data: { status: "APPROVED" } })}
            disabled={isPending}
            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[12px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
          >
            Approve
          </button>
          {seller.status !== "REJECTED" && (
            <button
              onClick={() => setRejecting((prev) => !prev)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Reject
            </button>
          )}
        </div>
      )}

      {seller.status === "APPROVED" && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#F2F1F8] pt-3.5">
          <button
            onClick={() => setRejecting((prev) => !prev)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Revoke approval
          </button>
        </div>
      )}

      {rejecting && (
        <div className="mt-3 space-y-2.5 rounded-xl border border-dashed border-[#E2E0EE] bg-[#FAFAFD] p-3.5">
          <p className="text-[12.5px] text-[#64748B]">
            Reason for rejecting {seller.user.name} (required):
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-[#E4E6EB] bg-white px-3.5 py-2.5 text-[13px] text-[#13131A] outline-none focus:border-violet-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setRejecting(false);
                setReason("");
              }}
              className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-[#64748B] hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={!reason.trim() || isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Confirm rejection"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
