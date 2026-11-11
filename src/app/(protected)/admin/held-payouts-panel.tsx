"use client";

import { useState } from "react";
import { AlertTriangle, Play } from "lucide-react";

import { useHeldPayouts, usePayHeldManually, useRunPayouts } from "@/src/hooks/use-held-payouts";
import { formatRelativeTime } from "@/src/lib/date";
import { PayoutRunResult } from "@/src/types/payout";

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const SKIP_LABEL: Record<PayoutRunResult["skipped"][string], string> = {
  NO_BANK_ACCOUNT: "no bank account",
  ACCOUNT_RECENTLY_CHANGED: "bank account changed recently",
  ALREADY_PAID_TODAY: "already paid today",
  BELOW_MINIMUM: "under ₦100",
};

/**
 * Hold-then-pay: money Nestly is holding for each seller, by state, with a
 * button to pay a seller's ready orders by hand and one to run payouts now.
 */
export default function HeldPayoutsPanel() {
  const { data, isLoading } = useHeldPayouts();
  const { mutate: payManually, isPending: paying } = usePayHeldManually();
  const { mutate: runNow, isPending: running, data: lastRun } = useRunPayouts();
  const [confirming, setConfirming] = useState<string | null>(null);

  if (isLoading || !data) return <div className="h-32 animate-pulse rounded-2xl bg-surface-2" />;
  if (!data.holdPayouts && data.stores.length === 0) return null;

  const skipped = lastRun?.data.skipped ?? {};

  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Held payouts</h3>
          <p className="mt-0.5 max-w-2xl text-[12.5px] text-muted">
            Sellers are paid once delivery is confirmed and the return window closes.{" "}
            {data.automaticTransfers
              ? "Paystack transfers go out automatically (once a day per seller)."
              : "Automatic transfers are off - send ready amounts yourself, then record them here."}
          </p>
        </div>
        {data.automaticTransfers && (
          <button
            onClick={() => runNow()}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12.5px] font-semibold text-ink hover:border-violet-300 disabled:opacity-50"
          >
            <Play size={13} /> {running ? "Running..." : "Run payouts now"}
          </button>
        )}
      </div>

      {data.failedTransfers.length > 0 && (
        <div className="space-y-1.5 rounded-xl border border-red-200 bg-red-50 p-3.5 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle size={14} /> Failed transfers (retried automatically)
          </p>
          {data.failedTransfers.map((failed) => (
            <p key={failed.id} className="text-[12px] text-red-700 dark:text-red-300">
              {money(failed.amount)} to {failed.store.name}, {formatRelativeTime(failed.createdAt)}: {failed.failureReason ?? "unknown reason"}
            </p>
          ))}
        </div>
      )}

      {data.stores.length === 0 ? (
        <p className="text-[13px] text-subtle">Nothing held right now.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead className="text-[11px] uppercase tracking-wide text-subtle">
              <tr>
                <th className="py-2 pr-3 font-semibold">Seller</th>
                <th className="py-2 pr-3 font-semibold">Ready</th>
                <th className="py-2 pr-3 font-semibold">Sending</th>
                <th className="py-2 pr-3 font-semibold">Return window</th>
                <th className="py-2 pr-3 font-semibold">On hold</th>
                <th className="py-2 pr-3 font-semibold">Not delivered</th>
                <th className="py-2 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {data.stores.map((store) => (
                <tr key={store.id}>
                  <td className="py-2.5 pr-3">
                    <p className="font-semibold text-ink">{store.name}</p>
                    <p className={store.bankAccount ? "text-subtle" : "text-amber-700 dark:text-amber-300"}>
                      {store.bankAccount ?? "No bank account"}
                      {store.bankOnHoldUntil ? " · changed recently" : ""}
                      {skipped[store.id] ? ` · skipped: ${SKIP_LABEL[skipped[store.id]]}` : ""}
                    </p>
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-emerald-700 dark:text-emerald-300">{money(store.totals.READY)}</td>
                  <td className="py-2.5 pr-3 text-ink">{money(store.totals.PROCESSING)}</td>
                  <td className="py-2.5 pr-3 text-ink">{money(store.totals.IN_RETURN_WINDOW)}</td>
                  <td className="py-2.5 pr-3 text-amber-700 dark:text-amber-300">{money(store.totals.ON_HOLD)}</td>
                  <td className="py-2.5 pr-3 text-muted">{money(store.totals.AWAITING_DELIVERY)}</td>
                  <td className="py-2.5 text-right">
                    {store.totals.READY > 0 &&
                      (confirming === store.id ? (
                        <span className="inline-flex gap-1.5">
                          <button
                            onClick={() => payManually({ storeId: store.id }, { onSettled: () => setConfirming(null) })}
                            disabled={paying}
                            className="rounded-lg bg-violet-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50"
                          >
                            I&apos;ve sent {money(store.totals.READY)}
                          </button>
                          <button onClick={() => setConfirming(null)} className="px-2 text-muted">
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirming(store.id)} className="rounded-lg border border-line px-3 py-1.5 font-semibold text-ink hover:border-violet-300">
                          Paid by hand
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
