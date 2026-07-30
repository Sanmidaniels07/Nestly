"use client";

import Link from "next/link";
import { Check, Users2 } from "lucide-react";
import { useSuggestedUsers } from "@/src/hooks/use-suggested-users";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";
import { SuggestedUser } from "@/src/types/user";
import UserAvatar from "@/src/components/ui/user-avatar";

export default function SuggestedUsers() {
  const { data: users, isLoading } = useSuggestedUsers(3);

  if (!isLoading && !users?.length) return null;

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Users2 size={16} className="text-violet-600" />
        </div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
          Suggested for you
        </h3>
      </div>

      <div className="mt-6 space-y-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-[#F7F7FB]" />
            ))
          : users?.map((user) => <SuggestionRow key={user.id} user={user} />)}
      </div>
    </div>
  );
}

function SuggestionRow({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isToggling } = useToggleFollow(user.id, false);

  return (
    <div className="group flex items-center justify-between gap-3">
      <Link
        href={`/users/${user.username ?? user.id}`}
        className="flex min-w-0 items-center gap-3.5"
      >
        <UserAvatar name={user.name} src={user.avatar} size={44} className="!rounded-2xl" />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-[#13131A]">{user.name}</p>
          <p className="truncate text-[12.5px] text-[#64748B]">
            {user.username ? `@${user.username}` : `${user.followerCount} followers`}
          </p>
        </div>
      </Link>

      <button
        onClick={toggleFollow}
        disabled={isToggling}
        className={`
          flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold
          transition-colors disabled:opacity-50
          ${
            isFollowing
              ? "border border-[#E5E7EB] text-[#64748B]"
              : "border border-violet-200 text-violet-600 hover:border-violet-300 hover:text-violet-700"
          }
        `}
      >
        {isFollowing && <Check size={13} />}
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
