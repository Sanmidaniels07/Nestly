"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import FollowButton from "./follow-button";
import UserAvatar from "@/src/components/ui/user-avatar";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";

interface Props {
  id: string;
  name: string;
  username?: string | null;
  bio?: string | null;
  followers?: number;
  avatar?: string | null;
  verified?: boolean;
  initialIsFollowing: boolean;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function UserCard({
  id,
  name,
  username,
  bio,
  followers,
  avatar,
  verified,
  initialIsFollowing,
}: Props) {
  const { isFollowing, toggleFollow } = useToggleFollow(id, initialIsFollowing);

  return (
    <article
      className="
        group relative flex items-start gap-5
        rounded-2xl border border-[#EDEBF5] bg-white
        p-5 transition-all duration-300
        hover:-translate-y-0.5 hover:border-violet-200
        hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.25)]
        sm:p-6
      "
    >
      <Link href={`/users/${username ?? id}`} className="shrink-0">
        <div className="rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-violet-600 p-[2px]">
          <div className="rounded-full bg-white p-[2.5px]">
            <UserAvatar name={name} src={avatar} size={56} />
          </div>
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/users/${username ?? id}`}
                className="truncate text-[17px] font-semibold text-[#13131A] hover:text-violet-600"
              >
                {name}
              </Link>
              {verified && (
                <BadgeCheck
                  size={16}
                  className="shrink-0 fill-violet-600 text-white"
                />
              )}
            </div>

            {username && (
              <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] text-violet-600">
                @{username}
              </p>
            )}
          </div>

          <div className="hidden sm:block">
            <FollowButton isFollowing={isFollowing} onClick={toggleFollow} />
          </div>
        </div>

        {bio && (
          <p className="mt-2.5 text-[14px] leading-relaxed text-[#64748B]">
            {bio}
          </p>
        )}

        {typeof followers === "number" && (
          <p className="mt-3 font-[family-name:var(--font-mono)] text-[12px] tracking-wide text-[#94A3B8]">
            {formatCount(followers)} followers
          </p>
        )}

        {/* Mobile follow button */}
        <div className="mt-4 sm:hidden">
          <FollowButton isFollowing={isFollowing} onClick={toggleFollow} />
        </div>
      </div>
    </article>
  );
}
