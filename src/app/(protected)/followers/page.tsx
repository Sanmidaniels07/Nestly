"use client";

import { useMemo, useState } from "react";
import { Search, UserX } from "lucide-react";
import Input from "@/src/components/ui/input";
import UserCard from "@/src/components/social/user-card";
import { suggestedUsers } from "@/src/mocks/users";

export default function FollowersPage() {
  const [query, setQuery] = useState("");

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestedUsers;

    return suggestedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
          {suggestedUsers.length} followers
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

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0EE] bg-white/60 px-8 py-16 text-center">
          <UserX className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-[#13131A]">
            No followers match "{query}"
          </p>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Try a different name or username.
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