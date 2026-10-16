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
    <div className="rounded-2xl border border-line bg-surface p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <Users2 size={16} className="text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-ink">
          Suggested for you
        </h3>
      </div>

      <div className="mt-6 space-y-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface-2" />
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
          <p className="truncate text-[13.5px] font-semibold text-ink">{user.name}</p>
          <p className="truncate text-[12.5px] text-muted">
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
              ? "border border-line-strong text-muted"
              : "border border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-700 dark:hover:text-violet-300"
          }
        `}
      >
        {isFollowing && <Check size={13} />}
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
