"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, UserCheck, Users2 } from "lucide-react";
import { StoreTraffic } from "@/src/types/payout";

interface Props {
  traffic?: StoreTraffic;
  isLoading?: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-[#ECE9F6] bg-white px-4 py-3 shadow-[0_12px_32px_-12px_rgba(15,15,20,0.2)]">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-mono)] text-[18px] font-semibold text-violet-700">
        {payload[0].value.toLocaleString()} views
      </p>
    </div>
  );
}

export default function TrafficChart({ traffic, isLoading }: Props) {
  if (isLoading || !traffic) {
    return <div className="h-[380px] animate-pulse rounded-2xl border border-[#ECE9F6] bg-[#F7F7FB]" />;
  }

  const stats = [
    { label: "Store views", value: traffic.totalViews, icon: Eye },
    { label: "Unique visitors", value: traffic.uniqueVisitors, icon: UserCheck },
    { label: "Followers", value: traffic.followersCount, icon: Users2 },
  ];

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
              <Icon size={16} className="text-violet-600" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-[#13131A]">
                {value.toLocaleString()}
              </p>
              <p className="text-[12px] text-[#94A3B8]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {traffic.dailyViews.every((d) => d.views === 0) ? (
        <div className="mt-6 flex h-[200px] items-center justify-center rounded-2xl border border-dashed border-[#E2E0EE] text-[13.5px] text-[#94A3B8]">
          No store views in this period yet.
        </div>
      ) : (
        <div className="mt-6 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={traffic.dailyViews} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#F2F1F8" vertical={false} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                width={32}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#DDD6FE", strokeWidth: 1 }} />

              <Area
                type="monotone"
                dataKey="views"
                stroke="#7C3AED"
                strokeWidth={2.5}
                fill="url(#trafficFill)"
                activeDot={{ r: 5, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
