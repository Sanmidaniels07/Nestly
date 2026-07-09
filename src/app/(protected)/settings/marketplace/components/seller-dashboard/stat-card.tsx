"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
  iconColor?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "bg-violet-50",
  iconColor = "text-violet-600",
  trend,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[13px] text-[#64748B]">{title}</p>
          <h3 className="mt-2 font-[family-name:var(--font-mono)] text-[28px] font-semibold leading-none text-[#13131A]">
            {value}
          </h3>

          {(subtitle || trend) && (
            <div className="mt-2.5 flex items-center gap-2">
              {trend && (
                <span
                  className={`flex items-center gap-0.5 font-[family-name:var(--font-mono)] text-[12px] font-medium ${
                    trend.direction === "up" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {trend.direction === "up" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {trend.value}
                </span>
              )}

              {subtitle && <p className="text-[12px] text-[#94A3B8]">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${color}`}>
          <Icon size={19} className={iconColor} />
        </div>
      </div>
    </div>
  );
}