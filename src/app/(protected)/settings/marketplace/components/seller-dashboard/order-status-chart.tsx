"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  breakdown: Record<string, number>;
  isLoading?: boolean;
}

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: "Pending", color: "#F59E0B", dot: "bg-amber-500" },
  PAID: { label: "Paid", color: "#10B981", dot: "bg-emerald-500" },
  PROCESSING: { label: "Processing", color: "#F59E0B", dot: "bg-amber-500" },
  SHIPPED: { label: "Shipped", color: "#3B82F6", dot: "bg-blue-500" },
  DELIVERED: { label: "Delivered", color: "#7C3AED", dot: "bg-violet-600" },
  CANCELLED: { label: "Cancelled", color: "#EF4444", dot: "bg-red-500" },
};

function metaFor(status: string) {
  return STATUS_META[status] ?? { label: status, color: "#94A3B8", dot: "bg-[#94A3B8]" };
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];

  return (
    <div className="rounded-xl border border-[#ECE9F6] bg-white px-4 py-2.5 shadow-[0_12px_32px_-12px_rgba(15,15,20,0.2)]">
      <p className="text-[12.5px] font-medium text-[#13131A]">{metaFor(entry.name).label}</p>
      <p className="font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
        {entry.value} order{entry.value === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export default function OrderStatusChart({ breakdown, isLoading }: Props) {
  const entries = Object.entries(breakdown).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (isLoading) {
    return <div className="h-[280px] animate-pulse rounded-2xl border border-[#ECE9F6] bg-[#F7F7FB]" />;
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-2xl border border-[#ECE9F6] bg-white text-[13.5px] text-[#94A3B8]">
        No orders yet.
      </div>
    );
  }

  const data = entries.map(([status, count]) => ({ name: status, value: count }));

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">Order status breakdown</h3>

      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[160px_1fr]">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={metaFor(entry.name).color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2.5">
          {entries.map(([status, count]) => {
            const meta = metaFor(status);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status} className="flex items-center justify-between gap-3 text-[13px]">
                <div className="flex items-center gap-2 text-[#334155]">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                  {meta.label}
                </div>
                <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[#94A3B8]">
                  <span className="text-[#13131A]">{count}</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
