"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTrendingCommunities } from "@/src/hooks/use-trending-communities";
import { useToggleCommunityMembership } from "@/src/hooks/use-toggle-community-membership";
import { Community } from "@/src/types/community";

const colors = [
  "from-violet-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
];

function formatCount(n?: number) {
  const value = n ?? 0;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function TrendingCommunities() {
  const { data: communities, isLoading } = useTrendingCommunities(4);

  if (!isLoading && !communities?.length) return null;

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#13131A]">
          Trending communities
        </h3>
        <Link
          href="/communities"
          className="flex items-center text-[12.5px] font-medium text-[#94A3B8] transition-colors hover:text-violet-600"
        >
          See all
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="mt-4 space-y-1">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-[#F7F7FB]" />
            ))
          : communities?.map((community, i) => (
              <CommunityRow
                key={community.id}
                community={community}
                color={colors[i % colors.length]}
              />
            ))}
      </div>
    </div>
  );
}

function CommunityRow({
  community,
  color,
}: {
  community: Community;
  color: string;
}) {
  const { isMember, toggleMembership, isToggling } = useToggleCommunityMembership(
    community.slug,
    community.isMember ?? false
  );

  return (
    <Link
      href={`/communities/${community.slug}`}
      className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#F7F7FB]"
    >
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-full
          bg-gradient-to-br text-[13px] font-semibold text-white
          ${color}
        `}
      >
        {community.name.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-[#13131A]">
          {community.name}
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
          {formatCount(community.memberCount)} members
        </p>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleMembership();
        }}
        disabled={isToggling}
        className={`
          shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold
          transition-colors disabled:opacity-50
          ${
            isMember
              ? "border border-[#E5E7EB] text-[#64748B] hover:border-red-200 hover:text-red-500"
              : "bg-violet-50 text-violet-600 hover:bg-violet-100"
          }
        `}
      >
        {isMember ? "Joined" : "Join"}
      </button>
    </Link>
  );
}
