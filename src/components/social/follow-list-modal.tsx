"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, UserX, X } from "lucide-react";

import UserAvatar from "@/src/components/ui/user-avatar";
import { useAuthStore } from "@/src/store/auth-store";
import { useFollowList, FollowListKind } from "@/src/hooks/use-follow-list";
import { useFollowStatus } from "@/src/hooks/use-follow-status";
import { useToggleFollow } from "@/src/hooks/use-toggle-follow";
import { useRemoveFollower } from "@/src/hooks/use-remove-follower";
import { PublicUser } from "@/src/types/user";

interface Props {
  /** Whose lists these are. */
  userId: string;
  /** Shown in the header, e.g. their username. */
  title: string;
  /** Which list is showing, or null when closed. */
  open: FollowListKind | null;
  onChange: (kind: FollowListKind) => void;
  onClose: () => void;
  followersCount?: number;
  followingCount?: number;
}

const formatCount = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

// Followers / Following, opened from the counts on a profile (like
// Instagram): a sheet over the page with a tab for each list, a search, and
// a follow button on every person.
export default function FollowListModal({ userId, title, open, onChange, onClose, followersCount, followingCount }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/50"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} - ${open}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-0 z-[100] flex flex-col bg-surface
              sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-[min(640px,85vh)] sm:w-[95%] sm:max-w-md
              sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl
              sm:shadow-[0_30px_90px_rgba(0,0,0,0.25)]
            "
          >
            <div className="relative flex items-center justify-center border-b border-line px-12 py-3.5">
              <h2 className="truncate text-[15px] font-semibold text-ink">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <div role="tablist" className="grid grid-cols-2 border-b border-line">
              {(["followers", "following"] as const).map((kind) => {
                const count = kind === "followers" ? followersCount : followingCount;
                const active = open === kind;
                return (
                  <button
                    key={kind}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onChange(kind)}
                    className={`relative py-3 text-[13.5px] font-semibold capitalize transition-colors ${
                      active ? "text-ink" : "text-subtle hover:text-ink-2"
                    }`}
                  >
                    {count !== undefined && <span className="font-[family-name:var(--font-mono)]">{formatCount(count)} </span>}
                    {kind}
                    {active && <motion.span layoutId="follow-list-tab" className="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-ink" />}
                  </button>
                );
              })}
            </div>

            {/* A fresh list (and search) per tab. */}
            <FollowList key={`${userId}:${open}`} userId={userId} kind={open} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FollowList({ userId, kind }: { userId: string; kind: FollowListKind }) {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useFollowList(userId, kind);
  const users = useMemo(() => data?.pages.flatMap((page) => page.users) ?? [], [data]);
  // Your own followers list gets a Remove button on each person.
  const me = useAuthStore((state) => state.user);
  const ownFollowers = kind === "followers" && me?.id === userId;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^@/, "");
    if (!q) return users;
    return users.filter((user) => user.name.toLowerCase().includes(q) || user.username?.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pb-2 pt-3">
        <label className="flex h-10 items-center gap-2 rounded-xl bg-surface-2 px-3 text-muted focus-within:ring-2 focus-within:ring-violet-500/30">
          <Search size={16} className="shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label={`Search ${kind}`}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-subtle"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
        {isLoading ? (
          <div className="space-y-1 px-2 pt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="h-11 w-11 animate-pulse rounded-full bg-surface-2" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="px-4 py-12 text-center text-[14px] text-muted">Couldn&apos;t load this list. Try again in a moment.</p>
        ) : shown.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <UserX className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
            <p className="mt-3 text-[14.5px] font-medium text-ink">
              {query ? `No one matches "${query}"` : kind === "followers" ? "No followers yet" : "Not following anyone yet"}
            </p>
            {query && hasNextPage && (
              <p className="mt-1 text-[13px] text-muted">Load more below to search further down the list.</p>
            )}
          </div>
        ) : (
          <ul>
            {shown.map((user) => (
              <FollowRow key={user.id} user={user} ownFollowers={ownFollowers} />
            ))}
          </ul>
        )}

        {hasNextPage && !isLoading && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full px-4 py-2 text-[13px] font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FollowRow({ user, ownFollowers }: { user: PublicUser; ownFollowers: boolean }) {
  const me = useAuthStore((state) => state.user);
  const isMe = me?.id === user.id;
  const { data: isFollowing, isLoading } = useFollowStatus(user.id, !isMe);
  const href = `/users/${user.username ?? user.id}`;

  const avatar = (
    <Link href={href} className="shrink-0">
      <UserAvatar name={user.name} src={user.avatar} size={44} />
    </Link>
  );

  // Your own followers: "Remove" (like Instagram), with a quick "Follow"
  // next to the name for people you don't follow back.
  if (ownFollowers && !isMe) {
    return (
      <li className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-2/60">
        {avatar}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <Link href={href} className="truncate text-[14px] font-semibold text-ink">
              {user.username ?? user.name}
            </Link>
            {!isLoading && !isFollowing && <FollowBackLink key={String(isFollowing)} userId={user.id} />}
          </div>
          {user.username && (
            <Link href={href} className="block truncate text-[13px] text-muted">
              {user.name}
            </Link>
          )}
        </div>
        <RemoveFollowerButton user={user} />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-2/60">
      {avatar}
      <Link href={href} className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-ink">{user.username ?? user.name}</p>
        <p className="truncate text-[13px] text-muted">{user.username ? user.name : ""}</p>
      </Link>
      {!isMe &&
        (isLoading ? (
          <div className="h-8 w-[84px] animate-pulse rounded-lg bg-surface-2" />
        ) : (
          <RowFollowButton key={String(isFollowing)} userId={user.id} initialIsFollowing={isFollowing ?? false} />
        ))}
    </li>
  );
}

function FollowBackLink({ userId }: { userId: string }) {
  const { isFollowing, toggleFollow } = useToggleFollow(userId, false);
  if (isFollowing) return null;
  return (
    <>
      <span className="text-[13px] text-subtle">·</span>
      <button type="button" onClick={toggleFollow} className="shrink-0 text-[13px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
        Follow
      </button>
    </>
  );
}

// Asks first (like Instagram), then makes them stop following you. They
// aren't told, and they can follow you again.
function RemoveFollowerButton({ user }: { user: PublicUser }) {
  const { mutate: remove, isPending, isSuccess } = useRemoveFollower();
  const [confirming, setConfirming] = useState(false);
  const who = user.username ? `@${user.username}` : user.name;

  if (isSuccess) {
    return <span className="shrink-0 px-2 text-[13px] font-medium text-subtle">Removed</span>;
  }

  if (confirming) {
    return (
      <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`Remove ${who} from your followers?`}>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="h-8 rounded-lg px-2.5 text-[13px] font-medium text-muted hover:bg-surface-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => remove(user.id)}
          disabled={isPending}
          className="h-8 rounded-lg bg-red-600 px-3 text-[13px] font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? "Removing..." : "Remove"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title={`Remove ${who} from your followers - they won't be told`}
      className="h-8 shrink-0 rounded-lg bg-surface-2 px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-line"
    >
      Remove
    </button>
  );
}

function RowFollowButton({ userId, initialIsFollowing }: { userId: string; initialIsFollowing: boolean }) {
  const { isFollowing, toggleFollow } = useToggleFollow(userId, initialIsFollowing);
  return (
    <button
      type="button"
      onClick={toggleFollow}
      className={`h-8 shrink-0 rounded-lg px-4 text-[13px] font-semibold transition-colors ${
        isFollowing
          ? "bg-surface-2 text-ink hover:bg-line"
          : "bg-violet-600 text-white hover:bg-violet-700"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
