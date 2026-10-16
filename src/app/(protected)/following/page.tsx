"use client";

import { Users } from "lucide-react";
import UserCard from "@/src/components/social/user-card";
import { useAuthStore } from "@/src/store/auth-store";
import { useFollowing } from "@/src/hooks/use-following";

export default function FollowingPage() {
  const authUser = useAuthStore((state) => state.user);
  const { data, isLoading } = useFollowing(authUser?.id ?? "", { limit: 50 });
  const users = data?.following ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
          {data?.total ?? 0} following
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[40px] italic leading-none text-ink">
          Following
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-8 py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-ink">
            You're not following anyone yet
          </p>
          <p className="mt-1 text-[14px] text-muted">
            Find people to follow and their posts will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              username={user.username}
              bio={user.bio}
              avatar={user.avatar}
              initialIsFollowing
            />
          ))}
        </div>
      )}
    </div>
  );
}
