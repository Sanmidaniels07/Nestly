"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";

interface Suggestion {
  name: string;
  username: string;
  mutuals: number;
}

const users: Suggestion[] = [
  { name: "Sarah Johnson", username: "sarahj", mutuals: 4 },
  { name: "Michael King", username: "mking", mutuals: 12 },
  { name: "Grace Samuel", username: "gracesam", mutuals: 2 },
];

export default function SuggestedPeople() {
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const toggle = (username: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.has(username) ? next.delete(username) : next.add(username);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h3 className="text-[15px] font-semibold text-[#13131A]">
        Suggested for you
      </h3>

      <div className="mt-4 space-y-4">
        {users.map((user) => {
          const isFollowing = following.has(user.username);

          return (
            <div key={user.username} className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px]">
                <div className="rounded-full bg-white p-[2px]">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                  {user.name}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
                  {user.mutuals} mutual{user.mutuals !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={() => toggle(user.username)}
                className={`
                  flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5
                  text-[12px] font-semibold transition-colors
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
        })}
      </div>
    </div>
  );
}