"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import SalesChart from "./sales-chart";
import { monthlySales } from "@/src/mocks/seller-analytics";

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SalesOverview() {
  const { total, change, isUp } = useMemo(() => {
    const last = monthlySales[monthlySales.length - 1]?.sales ?? 0;
    const prev = monthlySales[monthlySales.length - 2]?.sales ?? 0;
    const total = monthlySales.reduce((sum, m) => sum + m.sales, 0);
    const change = prev === 0 ? 0 : ((last - prev) / prev) * 100;

    return { total, change: Math.abs(change).toFixed(1), isUp: last >= prev };
  }, []);

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
      </div>

      <SalesChart />
    </section>
  );
}