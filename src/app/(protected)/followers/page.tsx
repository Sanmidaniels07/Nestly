"use client";

import { useMemo, useState } from "react";
import { Search, UserX } from "lucide-react";
import Input from "@/src/components/ui/input";
import UserCard from "@/src/components/social/user-card";
import { useAuthStore } from "@/src/store/auth-store";
import { useFollowers } from "@/src/hooks/use-followers";
import { useFollowStatus } from "@/src/hooks/use-follow-status";
import { PublicUser } from "@/src/types/user";

export default function FollowersPage() {
  const [query, setQuery] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const { data, isLoading } = useFollowers(authUser?.id ?? "", { limit: 50 });
  const followers = data?.followers ?? [];

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return followers;

    return followers.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q)
    );
  }, [followers, query]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
          {data?.total ?? 0} followers
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[40px] italic leading-none text-[#13131A]">
          Followers
        </h1>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search followers..."
        icon={<Search size={18} />}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <UserX className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">
            {query ? `No followers match "${query}"` : "No followers yet"}
          </p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            {query
              ? "Try a different name or username."
              : "Once people follow you, they'll show up here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <FollowerRow key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function FollowerRow({ user }: { user: PublicUser }) {
  const { data: isFollowing, isLoading } = useFollowStatus(user.id);

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-2xl bg-[#F7F7FB]" />;
  }

  return (
    <UserCard
      key={String(isFollowing)}
      id={user.id}
      name={user.name}
      username={user.username}
      bio={user.bio}
      avatar={user.avatar}
      initialIsFollowing={isFollowing ?? false}
    />
  );
}
