"use client";

import { useState } from "react";
import { BadgeCheck, Check, Copy, ExternalLink, ShieldCheck, Store as StoreIcon, UserRound } from "lucide-react";

import { useAdminSellers } from "@/src/hooks/use-admin-sellers";
import { useUpdateSellerStatus } from "@/src/hooks/use-update-seller-status";
import { useSetSellerVerified } from "@/src/hooks/use-set-seller-verified";
import { AdminSeller } from "@/src/types/admin-seller";
import { SellerApplicationStatus } from "@/src/types/seller";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";

const STATUS_TONE: Record<SellerApplicationStatus, string> = {
  PENDING: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
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
                : "border border-line-strong text-muted hover:border-violet-200 dark:hover:border-violet-500/30"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <StoreIcon className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-subtle">No seller applications match this filter.</p>
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

const CAC_SEARCH_URL = "https://search.cac.gov.ng";

// Manual CAC check: copy the number, look it up on the free CAC public
// search, then mark the business verified (drives the store's ✓ badge).
function CacCheck({ seller }: { seller: AdminSeller }) {
  const { mutate: setVerified, isPending } = useSetSellerVerified();
  const [copied, setCopied] = useState(false);

  if (!seller.cacNumber?.trim()) {
    return <p className="mt-2 text-[12px] text-subtle">No CAC number provided.</p>;
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(seller.cacNumber!.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked - the number is visible to copy by hand.
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-line-soft bg-surface-sunken p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-subtle">CAC</span>
        <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-ink">{seller.cacNumber}</span>
        <button
          onClick={copy}
          aria-label="Copy CAC number"
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] text-muted transition hover:bg-surface-2 hover:text-ink"
        >
          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            seller.isVerified
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
          }`}
        >
          {seller.isVerified ? "Verified" : "Not checked"}
        </span>
      </div>

      {!seller.isVerified && (
        <p className="mt-2 text-[12px] leading-snug text-muted">
          Search this number on CAC and confirm the business is <strong className="text-ink-2">active</strong> and its name matches
          {seller.store ? <> the store <strong className="text-ink-2">{seller.store.name}</strong></> : " this seller"}.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={CAC_SEARCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 transition hover:border-violet-300 dark:hover:border-violet-500/40"
        >
          <ExternalLink size={12} />
          Check on CAC
        </a>
        <button
          onClick={() => setVerified({ id: seller.id, isVerified: !seller.isVerified })}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition disabled:opacity-50 ${
            seller.isVerified
              ? "border border-line-strong text-muted hover:bg-surface-2"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {seller.isVerified ? "Remove verification" : (<><ShieldCheck size={13} /> Mark business verified</>)}
        </button>
      </div>
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
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-ink">{seller.user.name}</p>
            {seller.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
          </div>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {seller.user.email}
            {seller.user.username && ` · @${seller.user.username}`}
          </p>
          {seller.store && (
            <p className="mt-1 text-[12px] text-subtle">Store: {seller.store.name}</p>
          )}

          {/* Open in a new tab so the approval list keeps its place. */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            <a
              href={`/users/${seller.user.username ?? seller.user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 transition hover:border-violet-300 hover:text-violet-700 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
            >
              <UserRound size={13} /> View profile <ExternalLink size={11} className="text-subtle" />
            </a>
            {seller.store ? (
              <a
                href={`/marketplace/seller/${seller.store.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 transition hover:border-violet-300 hover:text-violet-700 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
              >
                <StoreIcon size={13} /> View store <ExternalLink size={11} className="text-subtle" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-1.5 text-[12px] text-subtle">
                <StoreIcon size={13} /> No store yet
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11.5px] text-subtle">
            Applied {formatRelativeTime(seller.createdAt)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[seller.status]}`}
          >
            {seller.status.toLowerCase()}
          </span>
        </div>
      </div>

      <CacCheck seller={seller} />

      {seller.statusReason && seller.status === "REJECTED" && (
        <p className="mt-2 rounded-lg bg-surface-sunken px-3 py-2 text-[12px] text-muted">
          Reason: {seller.statusReason}
        </p>
      )}

      {seller.status !== "APPROVED" && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
          <button
            onClick={() => updateStatus({ id: seller.id, data: { status: "APPROVED" } })}
            disabled={isPending}
            className="rounded-lg border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-50"
          >
            Approve
          </button>
          {seller.status !== "REJECTED" && (
            <button
              onClick={() => setRejecting((prev) => !prev)}
              className="rounded-lg border border-red-200 dark:border-red-500/30 px-3 py-1.5 text-[12px] font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Reject
            </button>
          )}
        </div>
      )}

      {seller.status === "APPROVED" && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
          <button
            onClick={() => setRejecting((prev) => !prev)}
            className="rounded-lg border border-red-200 dark:border-red-500/30 px-3 py-1.5 text-[12px] font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Revoke approval
          </button>
        </div>
      )}

      {rejecting && (
        <div className="mt-3 space-y-2.5 rounded-xl border border-dashed border-line-strong bg-surface-sunken p-3.5">
          <p className="text-[12.5px] text-muted">
            Reason for rejecting {seller.user.name} (required):
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-violet-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setRejecting(false);
                setReason("");
              }}
              className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-muted"
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
