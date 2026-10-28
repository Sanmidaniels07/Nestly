"use client";

import { useState } from "react";

import { useSellerSalesOverview } from "@/src/hooks/use-seller-sales-overview";
import { useSellerAnalytics } from "@/src/hooks/use-seller-analytics";
import { useStoreTraffic } from "@/src/hooks/use-store-traffic";
import SalesChart from "../seller-dashboard/sales-chart";
import OrderStatusChart from "../seller-dashboard/order-status-chart";
import CategoryRevenueChart from "../seller-dashboard/category-revenue-chart";
import TrafficChart from "../seller-dashboard/traffic-chart";
import CustomerMap from "../seller-dashboard/customer-map";

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
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
              Trend
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
              Sales over time
            </h2>
          </div>

          <div className="inline-flex gap-0.5 rounded-xl bg-surface-2 p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-all ${
                  period === p.value
                    ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300"
                    : "text-muted hover:text-ink"
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
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Breakdown
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
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
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Reach
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
            Store traffic
          </h2>
        </div>

        <TrafficChart traffic={traffic} isLoading={isLoadingTraffic} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Map
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
            Where your customers are
          </h2>
        </div>

        <CustomerMap days={period} />
      </section>
    </div>
  );
}
