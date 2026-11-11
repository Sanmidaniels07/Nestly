"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowDownToLine, Banknote, Clock, PackageCheck, ShieldAlert, Truck, Wallet } from "lucide-react";

import { useSellerEarnings } from "@/src/hooks/use-seller-earnings";
import { useSellerPayouts } from "@/src/hooks/use-seller-payouts";
import { useMyPayouts } from "@/src/hooks/use-held-payouts";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { StatTilesSkeleton } from "@/src/components/skeletons/stat-tiles-skeleton";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";
import { HeldOrder, HeldOrderState, MyPayouts } from "@/src/types/payout";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

const shortDate = (date: string) =>
  new Date(date).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

const STATE: Record<HeldOrderState, { label: string; tone: string; icon: typeof Clock }> = {
  READY: { label: "Paying soon", tone: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10", icon: Banknote },
  PROCESSING: { label: "On its way", tone: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10", icon: ArrowDownToLine },
  IN_RETURN_WINDOW: { label: "Return window", tone: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10", icon: Clock },
  ON_HOLD: { label: "On hold - report open", tone: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10", icon: ShieldAlert },
  AWAITING_DELIVERY: { label: "Awaiting delivery", tone: "text-muted bg-surface-muted", icon: Truck },
};

const orderHint = (order: HeldOrder) => {
  switch (order.state) {
    case "IN_RETURN_WINDOW":
      return order.releaseAt ? `Pays after ${shortDate(order.releaseAt)}` : "";
    case "ON_HOLD":
      return "Answer the report in Returns to release it";
    case "AWAITING_DELIVERY":
      return "Pays 3 days after the buyer confirms delivery (24 hours for perishables)";
    case "READY":
      return "In the next payout";
    case "PROCESSING":
      return "Transfer sent";
  }
};

export default function EarningsView() {
  const { data: mine, isLoading } = useMyPayouts();

  if (isLoading || !mine) {
    return <StatTilesSkeleton count={3} />;
  }

  // Before hold-then-pay is switched on (and with nothing held), sellers
  // keep the earlier balance view.
  const hasHeld = mine.orders.length > 0 || mine.payouts.some((payout) => payout.orderCount > 0);
  return (
    <div className="space-y-10">
      {(mine.holdPayouts || hasHeld) && <HeldEarnings mine={mine} />}
      {(!mine.holdPayouts || Math.round(mine.earlierBalance) !== 0) && <EarlierBalance held={mine.holdPayouts || hasHeld} />}
      <PayoutHistory />
    </div>
  );
}

function HeldEarnings({ mine }: { mine: MyPayouts }) {
  const { totals } = mine;
  const coming = totals.READY + totals.PROCESSING;
  const pending = totals.IN_RETURN_WINDOW + totals.AWAITING_DELIVERY;

  return (
    <section className="space-y-4">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Payouts
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] text-ink">Your earnings</h2>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
          Nestly holds each order&apos;s money until the buyer has it and the return window has closed - 3 days after
          they confirm delivery, 24 hours for food and other perishables. Then it&apos;s sent to your bank
          {mine.automaticTransfers ? " automatically, once a day" : " by the Nestly team"}. If a buyer reports a
          problem, that order waits until it&apos;s sorted.
        </p>
      </div>

      {!mine.bankAccount ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="flex items-center gap-2 text-[13px] font-medium text-amber-800 dark:text-amber-200">
            <AlertTriangle size={16} /> Add your bank account so we can pay you.
          </p>
          <Link href="/settings/marketplace?tab=store" className="text-[13px] font-semibold text-amber-800 underline dark:text-amber-200">
            Add bank account
          </Link>
        </div>
      ) : (
        <p className="text-[12.5px] text-muted">
          Payouts go to <span className="font-semibold text-ink">{mine.bankAccount}</span>
          {mine.bankOnHoldUntil && (
            <span className="text-amber-700 dark:text-amber-300">
              {" "}- recently changed, so payouts wait until {shortDate(mine.bankOnHoldUntil)} for your safety
            </span>
          )}
          .{" "}
          <Link href="/settings/marketplace?tab=store" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            Change
          </Link>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-5 dark:border-violet-500/30 dark:from-violet-500/10 dark:to-indigo-500/10">
          <Wallet size={16} className="text-violet-600 dark:text-violet-400" />
          <p className="mt-3 font-[family-name:var(--font-mono)] text-[21px] font-semibold text-violet-700 dark:text-violet-300">{money(coming)}</p>
          <p className="mt-1 text-[12.5px] text-muted">Paying soon</p>
        </div>
        <Tile icon={Clock} value={money(pending)} label="In the return window or on the way to buyers" />
        <Tile icon={ShieldAlert} value={money(totals.ON_HOLD)} label="On hold - problem reports" />
        <Tile icon={PackageCheck} value={money(mine.totalPaidOut)} label="Paid out so far" />
      </div>

      {mine.orders.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-[14px] font-semibold text-ink">Coming up</h3>
          {mine.orders.map((order) => {
            const state = STATE[order.state];
            return (
              <div key={order.orderId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-ink">
                    Order {order.orderNumber}
                    <span className="ml-2 font-normal text-muted">
                      {order.items.map((item) => `${item.title}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`).join(", ")}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-subtle">{orderHint(order)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${state.tone}`}>
                    <state.icon size={12} /> {state.label}
                  </span>
                  <p className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-ink">{money(order.amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Tile({ icon: Icon, value, label }: { icon: typeof Clock; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <Icon size={16} className="text-muted" />
      <p className="mt-3 font-[family-name:var(--font-mono)] text-[19px] font-semibold text-ink">{value}</p>
      <p className="mt-1 text-[12.5px] text-muted">{label}</p>
    </div>
  );
}

// The balance from orders before hold-then-pay (or every order while it's off).
function EarlierBalance({ held }: { held: boolean }) {
  const { data: earnings, isLoading } = useSellerEarnings();

  return (
    <section className="space-y-4">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Balance
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[22px] text-ink">
          {held ? "Earlier orders" : "Your earnings"}
        </h2>
      </div>

      {isLoading || !earnings ? (
        <StatTilesSkeleton count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Tile icon={Wallet} value={money(earnings.availableBalance)} label="Available balance" />
          <Tile icon={Banknote} value={money(earnings.totalRevenue)} label="Total revenue" />
          <Tile icon={ArrowDownToLine} value={money(earnings.totalPaidOut)} label="Total paid out" />
        </div>
      )}

      <p className="text-[12px] text-subtle">
        {held
          ? "From orders placed before payouts became automatic. The Nestly team pays this balance by hand."
          : "Payouts are issued by the Nestly team based on your available balance. It updates as orders are paid and delivered."}
      </p>
    </section>
  );
}

function PayoutHistory() {
  const [page, setPage] = useState(1);
  const { data: payoutsData, isLoading } = useSellerPayouts({ page, limit: 10 });
  const payouts = payoutsData?.payouts ?? [];

  return (
    <section className="space-y-4">
      <h3 className="text-[15px] font-semibold text-ink">Payout history</h3>

      {isLoading ? (
        <ListSkeleton count={4} withAvatar={false} />
      ) : payouts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <p className="text-[13.5px] text-subtle">No payouts yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {payouts.map((payout) => (
            <div key={payout.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-ink">{money(payout.amount)}</p>
                <p className="mt-0.5 text-[12px] text-subtle">
                  {formatRelativeTime(payout.createdAt)}
                  {payout.bankLabel ? ` · ${payout.bankLabel}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {payout.note && <p className="max-w-[260px] truncate text-right text-[12.5px] text-muted">{payout.note}</p>}
                {payout.status === "PENDING" ? (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11.5px] font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    On its way
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Paid
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {payoutsData && payoutsData.totalPages > 1 && (
        <Pagination page={payoutsData.page} totalPages={payoutsData.totalPages} onPageChange={setPage} />
      )}
    </section>
  );
}
