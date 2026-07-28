"use client";

import { use } from "react";
import { CalendarDays, Users2 } from "lucide-react";

import { useCommunity } from "@/src/hooks/use-community";
import { useToggleCommunityMembership } from "@/src/hooks/use-toggle-community-membership";

function formatCount(n?: number) {
  const value = n ?? 0;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatJoinedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: community, isLoading } = useCommunity(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-20 pt-6">
        <div className="h-40 animate-pulse rounded-2xl bg-[#F7F7FB]" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="mx-auto max-w-3xl pb-20 pt-16 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">Community not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20 pt-6">
      <div className="rounded-2xl border border-[#EDEBF5] bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
          {community.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={community.icon}
              alt={community.name}
              className="h-20 w-20 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-[28px] font-semibold text-white">
              {community.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
              <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic leading-none text-[#13131A]">
                {community.name}
              </h1>

              <MembershipButton slug={community.slug} initialIsMember={community.isMember ?? false} />
            </div>

            {community.description && (
              <p className="mt-4 text-[14.5px] leading-relaxed text-[#475569]">
                {community.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-[13px] text-[#64748B] sm:justify-start">
              <div className="flex items-center gap-1.5">
                <Users2 size={15} />
                {formatCount(community.memberCount)} members
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={15} />
                Created{" "}
                <span className="font-[family-name:var(--font-mono)]">
                  {formatJoinedDate(community.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MembershipButton({
  slug,
  initialIsMember,
}: {
  slug: string;
  initialIsMember: boolean;
}) {
  const { isMember, toggleMembership, isToggling } = useToggleCommunityMembership(
    slug,
    initialIsMember
  );

  return (
    <button
      onClick={toggleMembership}
      disabled={isToggling}
      className={`
        shrink-0 rounded-full px-5 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50
        ${
          isMember
            ? "border border-[#E5E7EB] text-[#64748B] hover:border-red-200 hover:text-red-500"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110"
        }
      `}
    >
      {isMember ? "Joined" : "Join community"}
    </button>
  );
}
