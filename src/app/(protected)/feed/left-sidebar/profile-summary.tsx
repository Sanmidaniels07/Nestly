"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";
import { useUserProfile } from "@/src/hooks/use-user-profile";
import UserAvatar from "@/src/components/ui/user-avatar";
import Skeleton from "@/src/components/ui/skeleton";

function formatCount(n?: number) {
  const value = n ?? 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function ProfileSummary() {
  const authUser = useAuthStore((state) => state.user);
  const { data: profile, isLoading } = useUserProfile(authUser?.id ?? "");

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton className="mt-6 h-12 w-full rounded-xl" />
      </div>
    );
  }

  const stats = [
    { label: "Following", value: profile?.followingCount },
    { label: "Followers", value: profile?.followersCount },
    { label: "Posts", value: profile?.postsCount },
  ];

  const name = profile?.name ?? authUser?.name;
  const username = profile?.username;

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center gap-4">
        <UserAvatar name={name} src={profile?.avatar} size={56} />

        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold text-[#13131A]">
            {name ?? "Your account"}
          </h3>
          <p className="truncate font-[family-name:var(--font-mono)] text-[13px] text-violet-600">
            {username ? `@${username}` : ""}
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
