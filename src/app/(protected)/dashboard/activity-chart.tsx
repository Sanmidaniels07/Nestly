"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DashboardActivityPoint, DashboardRange } from "@/src/types/user-dashboard";
import { shortDate } from "./format";

const RANGES: DashboardRange[] = [7, 30, 90];

const SERIES = [
  { key: "likes", label: "Likes", color: "#E11D48" },
  { key: "views", label: "Profile views", color: "#0EA5E9" },
  { key: "followers", label: "New followers", color: "#7C3AED" },
] as const;

interface Props {
  data: DashboardActivityPoint[];
  range: DashboardRange;
  onRangeChange: (range: DashboardRange) => void;
  isFetching: boolean;
}

interface TooltipProps {
  active?: boolean;
  label?: string;
  payload?: { dataKey: string; value: number; color: string }[];
}

function ChartTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3 shadow-[0_12px_32px_-12px_rgba(15,15,20,0.25)]">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-subtle">
        {shortDate(label)}
      </p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <p key={entry.dataKey} className="flex items-center gap-2 text-[12.5px] text-ink-2">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            {SERIES.find((s) => s.key === entry.dataKey)?.label}
            <span className="ml-auto pl-3 font-[family-name:var(--font-mono)] font-semibold text-ink">{entry.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function ActivityChart({ data, range, onRangeChange, isFetching }: Props) {
  const isEmpty = data.every((point) => !point.likes && !point.views && !point.followers);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Engagement
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic leading-none text-ink sm:text-[26px]">
            Your activity
          </h2>
        </div>

        <div className="inline-flex self-start rounded-xl bg-surface-2 p-1 sm:self-auto" role="group" aria-label="Date range">
          {RANGES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              aria-pressed={range === option}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
                range === option
                  ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300"
                  : "text-muted hover:text-ink"
              }`}
            >
              {option}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5 text-[12.5px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: series.color }} />
            {series.label}
          </span>
        ))}
      </div>

      <div className={`relative mt-5 h-[240px] transition-opacity sm:h-[280px] ${isFetching ? "opacity-60" : ""}`}>
        {isEmpty && (
          <p className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-[13px] text-subtle">
            No activity in the last {range} days yet — it&apos;ll show up here as people engage with you.
          </p>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tick={{ fill: "var(--subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis allowDecimals={false} tick={{ fill: "var(--subtle)", fontSize: 11 }} axisLine={false} tickLine={false} />
            {!isEmpty && <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--track)", strokeWidth: 1 }} />}
            {SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "var(--surface)", strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
