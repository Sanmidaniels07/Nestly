"use client";

import { useState } from "react";
import { BadgeCheck, Check, Copy, ExternalLink, RefreshCw, ShieldCheck, Store as StoreIcon, UserRound } from "lucide-react";

import { useAdminSellers } from "@/src/hooks/use-admin-sellers";
import { useUpdateSellerStatus } from "@/src/hooks/use-update-seller-status";
import { useSetSellerVerified } from "@/src/hooks/use-set-seller-verified";
import { useRecheckSellerCac } from "@/src/hooks/use-recheck-seller-cac";
import { CAC_RESULT_LABEL, cacTypeLabel } from "@/src/lib/cac";
import { AdminSeller, RejectMode } from "@/src/types/admin-seller";
import { useSellerOpenOrders } from "@/src/hooks/use-seller-open-orders";
import { SellerApplicationStatus } from "@/src/types/seller";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { useFormDraft } from "@/src/hooks/use-form-draft";

const STATUS_TONE: Record<SellerApplicationStatus, string> = {
  PENDING: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
};

// "Needs review": quick-start sellers already selling, waiting for an admin.
const STATUS_FILTERS: { label: string; value?: SellerApplicationStatus; needsReview?: boolean }[] = [
  { label: "Needs review", needsReview: true },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "All", value: undefined },
];

export default function SellersManager() {
  const [filterLabel, setFilterLabel] = useState(STATUS_FILTERS[0].label);
  const [page, setPage] = useState(1);
  const filter = STATUS_FILTERS.find((f) => f.label === filterLabel) ?? STATUS_FILTERS[0];

  const { data, isLoading } = useAdminSellers({
    status: filter.value,
    needsReview: filter.needsReview ? true : undefined,
    page,
    limit: 15,
  });
  const sellers = data?.sellers ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => {
              setFilterLabel(filter.label);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              filterLabel === filter.label
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

// CAC check: what the automatic lookup found (when it ran), plus the manual
// route - copy the number, look it up on the free CAC public search, then
// mark the business verified (drives the store's ✓ badge).
function CacCheck({ seller }: { seller: AdminSeller }) {
  const { mutate: setVerified, isPending } = useSetSellerVerified();
  const { mutate: recheck, isPending: rechecking } = useRecheckSellerCac();
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
          {seller.isVerified
            ? seller.cacCheckResult === "VERIFIED"
              ? "Auto-verified"
              : "Verified"
            : seller.cacCheckResult
              ? CAC_RESULT_LABEL[seller.cacCheckResult]
              : "Not checked"}
        </span>
      </div>

      {/* What the automatic lookup (Dojah) found on the CAC register. */}
      {seller.cacCheckResult && (
        <div className="mt-2 text-[12px] leading-snug text-muted">
          {seller.cacCheckedName ? (
            <p>
              Register: <strong className="text-ink-2">{seller.cacCheckedName}</strong>
              {seller.cacCheckedStatus && <> · {seller.cacCheckedStatus}</>}
              {seller.cacCompanyType && <> · {cacTypeLabel(seller.cacCompanyType)}</>}
            </p>
          ) : (
            <p>
              {seller.cacCheckResult === "NOT_FOUND"
                ? `Not found on the CAC register${seller.cacCompanyType ? ` as a ${cacTypeLabel(seller.cacCompanyType)?.toLowerCase()}` : ""}.`
                : "The automatic check couldn't run."}
            </p>
          )}
          {seller.cacCheckedAt && <p className="text-subtle">Checked {formatRelativeTime(seller.cacCheckedAt)}</p>}
        </div>
      )}

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
        {!seller.isVerified && (
          <button
            onClick={() => recheck(seller.id)}
            disabled={rechecking}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[12px] font-medium text-ink-2 transition hover:bg-surface-2 disabled:opacity-50"
          >
            <RefreshCw size={12} className={rechecking ? "animate-spin" : ""} />
            {seller.cacCheckResult ? "Check again" : "Run automatic check"}
          </button>
        )}
      </div>
    </div>
  );
}

function SellerRow({ seller }: { seller: AdminSeller }) {
  const { mutate: updateStatus, isPending } = useUpdateSellerStatus();

  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectMode, setRejectMode] = useState<RejectMode>("STOP_SALES");
  // When the card was drawn - for "waiting 30h" (kept stable across renders).
  const [now] = useState(() => Date.now());

  // A half-written rejection reason is kept in this browser (and the box
  // reopened) until it's sent or cancelled.
  const { clear: clearSaved } = useFormDraft(
    `admin:reject:${seller.id}`,
    { reason, rejectMode },
    (saved) => {
      setReason(saved.reason ?? "");
      setRejectMode(saved.rejectMode ?? "STOP_SALES");
      setRejecting(true);
    },
    { isEmpty: (value) => !value.reason.trim() }
  );

  const handleConfirmReject = () => {
    if (!reason.trim()) return;
    updateStatus(
      {
        id: seller.id,
        data: { status: "REJECTED", reason: reason.trim(), ...(seller.store ? { rejectMode } : {}) },
      },
      {
        onSuccess: () => {
          clearSaved();
          setRejecting(false);
          setReason("");
          setRejectMode("STOP_SALES");
        },
      }
    );
  };

  // Quick-start stores waiting for a review: how long, and overdue after 48h.
  const waitingHours =
    seller.store?.underReview && !seller.store.isSuspended && seller.store.createdAt
      ? Math.max(0, Math.floor((now - new Date(seller.store.createdAt).getTime()) / 3_600_000))
      : null;
  const overdue = waitingHours !== null && waitingHours >= REVIEW_OVERDUE_HOURS;

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
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-subtle">
              Store: {seller.store.name}
              {waitingHours !== null && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ${
                    overdue
                      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                  }`}
                >
                  {overdue ? "Review overdue" : "Selling · needs review"} · waiting {formatWait(waitingHours)}
                </span>
              )}
              {seller.store.salesStoppedAt && (
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                  Finishing open orders
                </span>
              )}
              {seller.store.isSuspended && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-red-700 dark:bg-red-500/10 dark:text-red-300">
                  Suspended
                </span>
              )}
            </p>
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
          {seller.store?.underReview && !seller.store.isSuspended && (
            <>
              <p className="w-full text-[12px] text-muted">
                Started selling {seller.store.createdAt ? formatRelativeTime(seller.store.createdAt) : "recently"} with quick start. Their payouts are
                held and orders capped until you mark them reviewed. Rejecting takes their store down.
              </p>
              <button
                onClick={() => updateStatus({ id: seller.id, data: { status: "APPROVED" } })}
                disabled={isPending}
                className="rounded-lg border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-50"
              >
                Mark reviewed
              </button>
            </>
          )}
          <button
            onClick={() => setRejecting((prev) => !prev)}
            className="rounded-lg border border-red-200 dark:border-red-500/30 px-3 py-1.5 text-[12px] font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            {seller.store?.underReview ? "Reject" : "Revoke approval"}
          </button>
        </div>
      )}

      {rejecting && (
        <div className="mt-3 space-y-2.5 rounded-xl border border-dashed border-line-strong bg-surface-sunken p-3.5">
          {seller.store && <RejectOptions sellerId={seller.id} mode={rejectMode} onChange={setRejectMode} />}
          <p className="text-[12.5px] text-muted">
            Reason for rejecting {seller.user.name} (required - the seller sees it):
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
                clearSaved();
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
              {isPending ? "Saving..." : rejectMode === "FRAUD" && seller.store ? "Reject and refund buyers" : "Confirm rejection"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const REVIEW_OVERDUE_HOURS = 48;

const formatWait = (hours: number) => (hours < 1 ? "under 1h" : hours < 48 ? `${hours}h` : `${Math.floor(hours / 24)} days`);

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

// Rejecting a seller with a store: what's in progress, and what each choice
// does to it - so nobody's order is left hanging.
function RejectOptions({ sellerId, mode, onChange }: { sellerId: string; mode: RejectMode; onChange: (mode: RejectMode) => void }) {
  const { data: open, isLoading } = useSellerOpenOrders(sellerId, true);

  const options: { value: RejectMode; title: string; text: string }[] = [
    {
      value: "STOP_SALES",
      title: "Stop new sales",
      text: "Not fraud (wrong items, store not up to standard). The store is hidden and takes no new orders. The seller can still finish the open orders - buyers are protected by their delivery code - and is paid for them as usual.",
    },
    {
      value: "FRAUD",
      title: "Fraud - cancel and refund",
      text: open
        ? `Scam or fake seller. ${open.refundableOrders} undelivered order${open.refundableOrders === 1 ? "" : "s"} (${money(open.refundableAmount)}) cancelled and refunded through Paystack, and the buyers are emailed.${
            open.manualOrders ? ` ${open.manualOrders} already paid to the seller - refund by hand.` : ""
          } Money for delivered orders stays held for you to decide.`
        : "Scam or fake seller. Everything not yet delivered is cancelled and refunded through Paystack, and the buyers are emailed.",
    },
  ];

  return (
    <div className="space-y-2.5">
      <p className="text-[12.5px] text-ink-2">
        {isLoading ? (
          "Checking their open orders…"
        ) : open && open.openOrders > 0 ? (
          <>
            <strong className="text-ink">
              {open.openOrders} open order{open.openOrders === 1 ? "" : "s"} · {money(open.openAmount)}
            </strong>{" "}
            not delivered yet · {money(open.heldAmount)} held by Nestly for this store.
          </>
        ) : (
          <>No open orders.{open && open.heldAmount > 0 ? ` ${money(open.heldAmount)} held by Nestly for this store.` : ""}</>
        )}
      </p>
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="How to reject">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={mode === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              mode === option.value
                ? option.value === "FRAUD"
                  ? "border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-500/10"
                  : "border-violet-400 bg-violet-50 dark:border-violet-500/50 dark:bg-violet-500/10"
                : "border-line bg-surface hover:border-violet-200 dark:hover:border-violet-500/30"
            }`}
          >
            <span className="block text-[13px] font-semibold text-ink">{option.title}</span>
            <span className="mt-1 block text-[11.5px] leading-relaxed text-muted">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
