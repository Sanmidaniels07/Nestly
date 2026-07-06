"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface Community {
  name: string;
  members: number;
  color: string;
}

const communities: Community[] = [
  { name: "Tech Founders", members: 12400, color: "from-violet-400 to-indigo-500" },
  { name: "Frontend Devs", members: 8900, color: "from-amber-400 to-orange-500" },
  { name: "Design Circle", members: 5200, color: "from-emerald-400 to-teal-500" },
  { name: "Startup Africa", members: 21100, color: "from-rose-400 to-pink-500" },
];

function formatCount(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function TrendingCommunities() {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggleJoin = (name: string) => {
    setJoined((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#13131A]">
          Trending communities
        </h3>
        <button className="flex items-center text-[12.5px] font-medium text-[#94A3B8] transition-colors hover:text-violet-600">
          See all
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        {communities.map((community) => {
          const isJoined = joined.has(community.name);

          return (
            <div
              key={community.name}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F7F7FB]"
            >
              <div
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                  bg-gradient-to-br text-[13px] font-semibold text-white
                  ${community.color}
                `}
              >
                {community.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                  {community.name}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                  {formatCount(community.members)} members
                </p>
              </div>

              <button
                onClick={() => toggleJoin(community.name)}
                className={`
                  shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold
                  transition-colors
                  ${
                    isJoined
                      ? "border border-[#E5E7EB] text-[#64748B] hover:border-red-200 hover:text-red-500"
                      : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                  }
                `}
              >
                {isJoined ? "Joined" : "Join"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}