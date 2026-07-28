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
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">
        Suggested for you
      </h3>

      <div className="mt-4 space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-[#F7F7FB]" />
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
          className="truncate text-[13.5px] font-medium text-[#13131A] hover:text-violet-600"
        >
          {user.name}
        </Link>
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
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
              ? "border border-[#E5E7EB] text-[#64748B]"
              : "bg-[#F6F3FF] text-violet-600 hover:bg-violet-100"
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
