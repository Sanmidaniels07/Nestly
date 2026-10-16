"use client";

import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useSuggestedUsers } from "@/src/hooks/use-suggested-users";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";
import { SuggestedUser } from "@/src/types/user";
import UserAvatar from "@/src/components/ui/user-avatar";

export default function SuggestedPeople() {
  const { data: users, isLoading } = useSuggestedUsers(3);

  if (!isLoading && !users?.length) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-[15px] font-semibold text-ink">
        Suggested for you
      </h3>

      <div className="mt-4 space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-surface-2" />
            ))
          : users?.map((user) => <SuggestionRow key={user.id} user={user} />)}
      </div>
    </div>
  );
}

function SuggestionRow({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow, isToggling } = useToggleFollow(user.id, false);

  return (
    <div className="flex items-center gap-3">
      <Link href={`/users/${user.username ?? user.id}`}>
        <UserAvatar name={user.name} src={user.avatar} size={44} />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/users/${user.username ?? user.id}`}
          className="truncate text-[13.5px] font-medium text-ink hover:text-violet-600 dark:hover:text-violet-400"
        >
          {user.name}
        </Link>
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
          {user.followerCount} follower{user.followerCount !== 1 ? "s" : ""}
        </p>
      </div>

      <button
        onClick={toggleFollow}
        disabled={isToggling}
        className={`
          flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5
          text-[12px] font-semibold transition-colors disabled:opacity-50
          ${
            isFollowing
              ? "border border-line-strong text-muted"
              : "bg-tint text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/15"
          }
        `}
      >
        {isFollowing ? (
          <>
            <Check size={12} />
            Following
          </>
        ) : (
          <>
            <Plus size={12} />
            Follow
          </>
        )}
      </button>
    </div>
  );
}
