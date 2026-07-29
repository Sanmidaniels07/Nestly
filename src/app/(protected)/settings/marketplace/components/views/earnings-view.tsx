"use client";

import { useState } from "react";
import { ArrowDownToLine, Wallet } from "lucide-react";

import { useSellerEarnings } from "@/src/hooks/use-seller-earnings";
import { useSellerPayouts } from "@/src/hooks/use-seller-payouts";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { StatTilesSkeleton } from "@/src/components/skeletons/stat-tiles-skeleton";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EarningsView() {
  const [page, setPage] = useState(1);
  const { data: earnings, isLoading: isLoadingEarnings } = useSellerEarnings();
  const { data: payoutsData, isLoading: isLoadingPayouts } = useSellerPayouts({
    page,
    limit: 10,
  });

  const payouts = payoutsData?.payouts ?? [];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Balance
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Your earnings
          </h2>
        </div>

        {isLoadingEarnings || !earnings ? (
          <StatTilesSkeleton count={3} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
                  <Wallet size={16} className="text-violet-600" />
                </div>
              </div>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[22px] font-semibold text-violet-700">
                {money(earnings.availableBalance)}
              </p>
              <p className="mt-1 text-[12.5px] text-[#64748B]">Available balance</p>
            </div>

            <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
              <p className="font-[family-name:var(--font-mono)] text-[20px] font-semibold text-[#13131A]">
                {money(earnings.totalRevenue)}
              </p>
              <p className="mt-1 text-[12.5px] text-[#64748B]">Total revenue</p>
            </div>

            <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
              <div className="flex items-center gap-1.5">
                <ArrowDownToLine size={14} className="text-[#64748B]" />
                <p className="font-[family-name:var(--font-mono)] text-[20px] font-semibold text-[#13131A]">
                  {money(earnings.totalPaidOut)}
                </p>
              </div>
              <p className="mt-1 text-[12.5px] text-[#64748B]">Total paid out</p>
            </div>
          </div>
        )}

        <p className="text-[12px] text-[#94A3B8]">
          Payouts are issued by the Nestly team based on your available balance. Your available
          balance updates automatically as orders are paid and delivered.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-[15px] font-semibold text-[#13131A]">Payout history</h3>

        {isLoadingPayouts ? (
          <ListSkeleton count={4} withAvatar={false} />
        ) : payouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
            <p className="text-[13.5px] text-[#94A3B8]">No payouts yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#ECE9F6] bg-white p-4"
              >
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-[#13131A]">
                    {money(payout.amount)}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#94A3B8]">
                    {formatRelativeTime(payout.createdAt)}
                  </p>
                </div>
                {payout.note && (
                  <p className="max-w-[50%] truncate text-right text-[12.5px] text-[#64748B]">
                    {payout.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {payoutsData && payoutsData.totalPages > 1 && (
          <Pagination
            page={payoutsData.page}
            totalPages={payoutsData.totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
