"use client";

import { useState } from "react";

import { useSellerSalesOverview } from "@/src/hooks/use-seller-sales-overview";
import { useSellerAnalytics } from "@/src/hooks/use-seller-analytics";
import { useStoreTraffic } from "@/src/hooks/use-store-traffic";
import SalesChart from "../seller-dashboard/sales-chart";
import OrderStatusChart from "../seller-dashboard/order-status-chart";
import CategoryRevenueChart from "../seller-dashboard/category-revenue-chart";
import TrafficChart from "../seller-dashboard/traffic-chart";

const PERIODS = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "6 months", value: 180 },
] as const;

export default function AnalyticsView() {
  const [period, setPeriod] = useState<number>(90);

  const { data: sales, isLoading: isLoadingSales } = useSellerSalesOverview(period);
  const { data: analytics, isLoading: isLoadingAnalytics } = useSellerAnalytics();
  const { data: traffic, isLoading: isLoadingTraffic } = useStoreTraffic(period);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
              Trend
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
              Sales over time
            </h2>
          </div>

          <div className="inline-flex gap-0.5 rounded-xl bg-[#F7F7FB] p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-all ${
                  period === p.value
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-[#64748B] hover:text-[#13131A]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <SalesChart data={sales ?? []} isLoading={isLoadingSales} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Breakdown
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Orders &amp; revenue mix
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <OrderStatusChart
            breakdown={analytics?.orderStatusBreakdown ?? {}}
            isLoading={isLoadingAnalytics}
          />
          <CategoryRevenueChart
            categories={analytics?.revenueByCategory ?? []}
            isLoading={isLoadingAnalytics}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Reach
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Store traffic
          </h2>
        </div>

        <TrafficChart traffic={traffic} isLoading={isLoadingTraffic} />
      </section>
    </div>
  );
}
