"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Hash, Search, Users2, X } from "lucide-react";

import { useQuickSearch } from "@/src/hooks/use-quick-search";
import UserAvatar from "@/src/components/ui/user-avatar";

export default function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isLoading } = useQuickSearch(debouncedQuery);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResults = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  const hasResults =
    !!data &&
    (data.users.length > 0 ||
      data.posts.length > 0 ||
      data.communities.length > 0 ||
      data.hashtags.length > 0);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="flex h-10 w-64 items-center gap-2 rounded-xl border border-[#ECE9F6] bg-[#F7F7FB] px-3.5 transition-colors focus-within:border-violet-300 focus-within:bg-white lg:w-80">
        <Search size={16} className="shrink-0 text-[#94A3B8]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && goToResults()}
          placeholder="Search Nestly..."
          className="w-full bg-transparent text-[13.5px] text-[#13131A] outline-none placeholder:text-[#94A3B8]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
            }}
            aria-label="Clear search"
            className="shrink-0 text-[#94A3B8] hover:text-[#334155]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && debouncedQuery && (
        <div className="absolute left-0 top-12 z-50 w-full min-w-[320px] overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-[#F7F7FB]" />
              ))}
            </div>
          ) : !hasResults ? (
            <p className="px-4 py-6 text-center text-[13px] text-[#94A3B8]">
              No results for &quot;{debouncedQuery}&quot;
            </p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto py-2">
              {!!data?.users.length && (
                <ResultGroup label="People">
                  {data.users.map((user) => (
                    <ResultRow
                      key={user.id}
                      onClick={() => {
                        router.push(`/users/${user.username ?? user.id}`);
                        setOpen(false);
                      }}
                    >
                      <UserAvatar name={user.name} src={user.avatar} size={28} />
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                          {user.name}
                        </p>
                        {user.username && (
                          <p className="truncate text-[11.5px] text-[#94A3B8]">
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {!!data?.communities.length && (
                <ResultGroup label="Communities">
                  {data.communities.map((community) => (
                    <ResultRow
                      key={community.id}
                      onClick={() => {
                        router.push(`/communities/${community.slug}`);
                        setOpen(false);
                      }}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Users2 size={13} />
                      </div>
                      <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                        {community.name}
                      </p>
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {!!data?.hashtags.length && (
                <ResultGroup label="Hashtags">
                  {data.hashtags.map((hashtag) => (
                    <ResultRow
                      key={hashtag.id}
                      onClick={() => {
                        router.push(`/hashtags/${hashtag.tag}`);
                        setOpen(false);
                      }}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7F7FB] text-[#64748B]">
                        <Hash size={13} />
                      </div>
                      <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                        #{hashtag.tag}
                      </p>
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {!!data?.posts.length && (
                <ResultGroup label="Posts">
                  {data.posts.map((post) => (
                    <ResultRow
                      key={post.id}
                      onClick={() => {
                        router.push(`/users/${post.author?.username ?? post.author?.id}`);
                        setOpen(false);
                      }}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                          {post.title || post.content || "Post"}
                        </p>
                        <p className="truncate text-[11.5px] text-[#94A3B8]">
                          by {post.author?.name ?? "Unknown"}
                        </p>
                      </div>
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              <button
                onClick={goToResults}
                className="mt-1 w-full border-t border-[#F2F1F8] px-4 py-2.5 text-center text-[12.5px] font-medium text-violet-600 hover:bg-violet-50"
              >
                See all results for &quot;{debouncedQuery}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-2 py-1">
      <p className="px-2.5 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ResultRow({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#F7F7FB]"
    >
      {children}
    </button>
  );
}
