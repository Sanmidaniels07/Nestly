"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useSuggestedUsers } from "@/src/hooks/use-suggested-users";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";
import { SuggestedUser } from "@/src/types/user";
import UserAvatar from "@/src/components/ui/user-avatar";

export default function SuggestedUsers() {
  const { data: users, isLoading } = useSuggestedUsers(3);

  if (!isLoading && !users?.length) return null;

  return (
    <div className="bg-white rounded-2xl p-8 border border-[#EDEBF5]">
      <h3 className="text-xl font-semibold mb-6">Suggested for you</h3>

      <div className="space-y-6">
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
    <div className="flex items-center justify-between group">
      <Link
        href={`/users/${user.username ?? user.id}`}
        className="flex items-center gap-4"
      >
        <UserAvatar name={user.name} src={user.avatar} size={48} className="!rounded-2xl" />
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">
            {user.username ? `@${user.username}` : `${user.followerCount} followers`}
          </p>
        </div>
      </Link>

      <button
        onClick={toggleFollow}
        disabled={isToggling}
        className={`
          flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold
          transition-colors disabled:opacity-50
          ${
            isFollowing
              ? "border border-gray-200 text-gray-500"
              : "border border-violet-200 text-violet-600 hover:border-violet-300 hover:text-violet-700"
          }
        `}
      >
        {isFollowing && <Check size={14} />}
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
