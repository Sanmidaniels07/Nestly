"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlySales } from "@/src/mocks/seller-analytics";

type Period = "6M" | "12M" | "ALL";

const periods: Period[] = ["6M", "12M", "ALL"];

function formatCompact(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-[#ECE9F6] bg-white px-4 py-3 shadow-[0_12px_32px_-12px_rgba(15,15,20,0.2)]">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-mono)] text-[18px] font-semibold text-violet-700">
        ₦{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function SalesChart() {
  const [period, setPeriod] = useState<Period>("6M");

  const data = useMemo(() => {
    if (period === "6M") return monthlySales.slice(-6);
    if (period === "12M") return monthlySales.slice(-12);
    return monthlySales;
  }, [period]);

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center justify-end">
        <div className="flex gap-1 rounded-lg bg-[#F7F7FB] p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11.5px] font-medium transition-colors
                ${period === p ? "bg-white text-violet-700 shadow-sm" : "text-[#94A3B8] hover:text-[#334155]"}
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F2F1F8" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={formatCompact}
              width={56}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#DDD6FE", strokeWidth: 1 }} />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#7C3AED"
              strokeWidth={2.5}
              fill="url(#salesFill)"
              activeDot={{ r: 5, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}