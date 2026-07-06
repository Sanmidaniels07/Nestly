"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const stats = [
  { label: "Following", value: 345 },
  { label: "Followers", value: 1834 },
  { label: "Posts", value: 62 },
];

export default function ProfileSummary() {
  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[2.5px]">
          <div className="rounded-full bg-white p-[3px]">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200" />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold text-[#13131A]">
            Daniel Sanmi
          </h3>
          <p className="font-[family-name:var(--font-mono)] text-[13px] text-violet-600">
            @daniel
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-[#F0EEF9]">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center first:pl-0 last:pr-0">
            <p className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-[#13131A]">
              {formatCount(stat.value)}
            </p>
            <p className="mt-0.5 text-[12px] text-[#94A3B8]">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link
        href="/profile"
        className="
          group mt-6 flex items-center justify-center gap-1.5
          rounded-xl bg-[#F6F3FF] py-2.5
          text-[13px] font-semibold text-violet-600
          transition-colors hover:bg-violet-100
        "
      >
        View profile
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  );
}