"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import UserCard from "@/src/components/social/user-card";
import { suggestedUsers } from "@/src/mocks/users";
import { useFollowStore } from "@/src/store/follow.store";

export default function FollowingPage() {
  const followingIds = useFollowStore((state) => state.followingIds);

  const users = useMemo(
    () => suggestedUsers.filter((user) => followingIds.includes(user.id)),
    [followingIds]
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
          {users.length} following
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[40px] italic leading-none text-[#13131A]">
          Following
        </h1>
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">
            You're not following anyone yet
          </p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Find people to follow and their posts will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard key={user.id} {...user} />
          ))}
        </div>
      )}
    </div>
  );
}