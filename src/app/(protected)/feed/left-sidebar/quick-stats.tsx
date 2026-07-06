"use client";

import { Eye, FileText, TrendingUp } from "lucide-react";

const metrics = [
  { icon: FileText, label: "Posts this week", value: 12 },
  { icon: Eye, label: "Profile views", value: 324 },
];

export default function QuickStats() {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-violet-600" />
        <h3 className="text-[15px] font-semibold text-[#13131A]">
          Your activity
        </h3>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-[#64748B]">
            Profile completion
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-600">
            85%
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0EEF9]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
            style={{ width: "85%" }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3.5 border-t border-[#F2F1F8] pt-5">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#64748B]">
              <Icon size={15} />
              <span className="text-[13.5px]">{label}</span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[14px] font-semibold text-[#13131A]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}