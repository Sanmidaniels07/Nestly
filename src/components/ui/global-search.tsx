"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Hash, Search, Store, Users2, X } from "lucide-react";

import { useQuickSearch } from "@/src/hooks/use-quick-search";
import UserAvatar from "@/src/components/ui/user-avatar";

// Shared by the desktop search box and the full-screen mobile search: the
// query, its debounced value, the quick-search results and navigation.
function useGlobalSearch(onDone: () => void) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isLoading } = useQuickSearch(debouncedQuery);

  const go = (href: string) => {
    router.push(href);
    onDone();
  };

  const goToResults = () => {
    if (!query.trim()) return;
    go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const clear = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  return { query, setQuery, debouncedQuery, data, isLoading, go, goToResults, clear };
}

type SearchState = ReturnType<typeof useGlobalSearch>;

/** Desktop/tablet: inline box in the navbar with a dropdown of results. */
export default function GlobalSearch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const search = useGlobalSearch(() => setOpen(false));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="flex h-10 w-64 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3.5 transition-colors focus-within:border-violet-300 dark:focus-within:border-violet-500/40 focus-within:bg-surface lg:w-80">
        <Search size={16} className="shrink-0 text-subtle" />
        <input
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && search.goToResults()}
          placeholder="Search Nestly..."
          className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-subtle"
        />
        {search.query && (
          <button onClick={search.clear} aria-label="Clear search" className="shrink-0 text-subtle hover:text-ink-2">
            <X size={14} />
          </button>
        )}
      </div>

      {open && search.debouncedQuery && (
        <div className="absolute left-0 top-12 z-50 w-full min-w-[320px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]">
          <div className="max-h-[420px] overflow-y-auto">
            <SearchResults search={search} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Phones: a search icon in the navbar (same size as cart/bell) that opens a
 * full-screen search with the keyboard up - no room for an inline box.
 */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const search = useGlobalSearch(close);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus after the overlay mounts so the keyboard opens on iOS/Android.
    const focus = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      clearTimeout(focus);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-violet-200 hover:text-violet-600 dark:hover:border-violet-500/30 dark:hover:text-violet-400 md:hidden"
      >
        <Search size={18} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex flex-col bg-surface md:hidden" role="dialog" aria-label="Search Nestly">
            <div className="flex h-16 shrink-0 items-center gap-2 border-b border-line px-3">
              <button onClick={close} aria-label="Close search" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface-2">
                <ArrowLeft size={19} />
              </button>
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3.5 focus-within:border-violet-300 dark:focus-within:border-violet-500/40">
                <Search size={16} className="shrink-0 text-subtle" />
                <input
                  ref={inputRef}
                  value={search.query}
                  onChange={(e) => search.setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && search.goToResults()}
                  placeholder="Search people, stores, posts..."
                  enterKeyHint="search"
                  className="w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-subtle"
                />
                {search.query && (
                  <button onClick={search.clear} aria-label="Clear search" className="shrink-0 text-subtle hover:text-ink-2">
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
              {search.debouncedQuery ? (
                <SearchResults search={search} />
              ) : (
                <p className="px-6 py-10 text-center text-[13.5px] text-subtle">
                  Search for people, stores, communities, hashtags and posts.
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function SearchResults({ search }: { search: SearchState }) {
  const { data, isLoading, debouncedQuery, go, goToResults } = search;

  const hasResults =
    !!data &&
    (data.users.length > 0 ||
      (data.stores?.length ?? 0) > 0 ||
      data.posts.length > 0 ||
      data.communities.length > 0 ||
      data.hashtags.length > 0);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-2" />
        ))}
      </div>
    );
  }

  if (!hasResults) {
    return (
      <p className="px-4 py-6 text-center text-[13px] text-subtle">
        No results for &quot;{debouncedQuery}&quot;
      </p>
    );
  }

  return (
    <div className="py-2">
      {!!data?.users.length && (
        <ResultGroup label="People">
          {data.users.map((user) => (
            <ResultRow key={user.id} onClick={() => go(`/users/${user.username ?? user.id}`)}>
              <UserAvatar name={user.name} src={user.avatar} size={28} />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium text-ink">{user.name}</p>
                {user.username && <p className="truncate text-[11.5px] text-subtle">@{user.username}</p>}
              </div>
            </ResultRow>
          ))}
        </ResultGroup>
      )}

      {!!data?.stores?.length && (
        <ResultGroup label="Stores">
          {data.stores.map((store) => (
            <ResultRow key={store.id} onClick={() => go(`/marketplace/seller/${store.slug}`)}>
              {store.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={store.logo} alt={store.name} className="h-7 w-7 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Store size={13} />
                </div>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-[13.5px] font-medium text-ink">
                  <span className="truncate">{store.name}</span>
                  {store.isVerified && <BadgeCheck size={13} className="shrink-0 text-violet-600 dark:text-violet-400" />}
                </p>
                {store.city && <p className="truncate text-[11.5px] text-subtle">{store.city}</p>}
              </div>
            </ResultRow>
          ))}
        </ResultGroup>
      )}

      {!!data?.communities.length && (
        <ResultGroup label="Communities">
          {data.communities.map((community) => (
            <ResultRow key={community.id} onClick={() => go(`/communities/${community.slug}`)}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <Users2 size={13} />
              </div>
              <p className="truncate text-[13.5px] font-medium text-ink">{community.name}</p>
            </ResultRow>
          ))}
        </ResultGroup>
      )}

      {!!data?.hashtags.length && (
        <ResultGroup label="Hashtags">
          {data.hashtags.map((hashtag) => (
            <ResultRow key={hashtag.id} onClick={() => go(`/hashtags/${hashtag.tag}`)}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted">
                <Hash size={13} />
              </div>
              <p className="truncate text-[13.5px] font-medium text-ink">#{hashtag.tag}</p>
            </ResultRow>
          ))}
        </ResultGroup>
      )}

      {!!data?.posts.length && (
        <ResultGroup label="Posts">
          {data.posts.map((post) => (
            <ResultRow key={post.id} onClick={() => go(`/users/${post.author?.username ?? post.author?.id}`)}>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium text-ink">{post.title || post.content || "Post"}</p>
                <p className="truncate text-[11.5px] text-subtle">by {post.author?.name ?? "Unknown"}</p>
              </div>
            </ResultRow>
          ))}
        </ResultGroup>
      )}

      <button
        onClick={goToResults}
        className="mt-1 w-full border-t border-line-soft px-4 py-2.5 text-center text-[12.5px] font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10"
      >
        See all results for &quot;{debouncedQuery}&quot;
      </button>
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-2 py-1">
      <p className="px-2.5 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-subtle">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ResultRow({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-surface-2"
    >
      {children}
    </button>
  );
}
