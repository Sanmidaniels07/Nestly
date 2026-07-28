"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Users2 } from "lucide-react";

import Input from "@/src/components/ui/input";
import { useCommunities } from "@/src/hooks/use-communities";
import { useToggleCommunityMembership } from "@/src/hooks/use-toggle-community-membership";
import { Community } from "@/src/types/community";
import CreateCommunityModal from "./create-community-modal";

function formatCount(n?: number) {
  const value = n ?? 0;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading } = useCommunities({ search: search || undefined, limit: 30 });
  const communities = data?.communities ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
            {data?.total ?? 0} communities
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[40px] italic leading-none text-[#13131A]">
            Communities
          </h1>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Plus size={16} />
          Create community
        </button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search communities..."
        icon={<Search size={18} />}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <Users2 className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">
            {search ? `No communities match "${search}"` : "No communities yet"}
          </p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            {search ? "Try a different search." : "Be the first to create one."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}

      <CreateCommunityModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function CommunityCard({ community }: { community: Community }) {
  const { isMember, toggleMembership, isToggling } = useToggleCommunityMembership(
    community.slug,
    community.isMember ?? false
  );

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EDEBF5] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.25)]">
      <Link href={`/communities/${community.slug}`} className="flex items-start gap-3">
        {community.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={community.icon}
            alt={community.name}
            className="h-12 w-12 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-[16px] font-semibold text-white">
            {community.name.charAt(0)}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-[#13131A]">
            {community.name}
          </h3>
          <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
            {formatCount(community.memberCount)} members
          </p>
        </div>
      </Link>

      {community.description && (
        <p className="line-clamp-2 text-[13.5px] leading-relaxed text-[#64748B]">
          {community.description}
        </p>
      )}

      <button
        onClick={toggleMembership}
        disabled={isToggling}
        className={`
          w-full rounded-full py-2 text-[12.5px] font-semibold transition-colors disabled:opacity-50
          ${
            isMember
              ? "border border-[#E5E7EB] text-[#64748B] hover:border-red-200 hover:text-red-500"
              : "bg-violet-50 text-violet-600 hover:bg-violet-100"
          }
        `}
      >
        {isMember ? "Joined" : "Join"}
      </button>
    </div>
  );
}
