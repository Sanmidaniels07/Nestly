"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import SalesChart from "./sales-chart";
import { useSellerSalesOverview } from "@/src/hooks/use-seller-sales-overview";

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SalesOverview() {
  const { data: sales, isLoading } = useSellerSalesOverview(180);
  const points = sales ?? [];

  const { total, change, isUp } = useMemo(() => {
    const last = points[points.length - 1]?.sales ?? 0;
    const prev = points[points.length - 2]?.sales ?? 0;
    const total = points.reduce((sum, m) => sum + m.sales, 0);
    const change = prev === 0 ? 0 : ((last - prev) / prev) * 100;

    return { total, change: Math.abs(change).toFixed(1), isUp: last >= prev };
  }, [points]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Performance
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Sales overview
          </h2>
        </div>

        {!isLoading && points.length > 0 && (
          <div className="flex items-baseline gap-3">
            <p className="font-[family-name:var(--font-mono)] text-[26px] font-semibold text-[#13131A]">
              {formatNaira(total)}
            </p>
            <span
              className={`flex items-center gap-1 font-[family-name:var(--font-mono)] text-[13px] font-medium ${
                isUp ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change}%
            </span>
          </div>
        )}
      </div>

      <SalesChart data={points} isLoading={isLoading} />
    </section>
  );
}
