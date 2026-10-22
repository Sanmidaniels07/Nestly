"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, Loader2, RefreshCw, ShoppingBag, Sparkles, Users2 } from "lucide-react";

import { getPosts } from "@/src/services/post.services";
import { usePullToRefresh } from "@/src/hooks/use-pull-to-refresh";
import { useAuthStore } from "@/src/store/auth-store";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { usePosts } from "@/src/hooks/use-posts";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";
import SuggestedPeople from "../right-sidebar/suggested-friends";
import MarketplacePreview from "../right-sidebar/marketplace-preview";
import TrendingCommunities from "../left-sidebar/trending-communities";

// On smaller screens the sidebars are hidden, so their best cards are woven
// into the feed between posts (Instagram-style) instead of stacked above it.
// Each slot hides itself once its sidebar is visible: the right sidebar
// (people, marketplace) appears at xl, the left one (communities) at lg.
const INTERSTITIALS = [
  { afterPost: 3, key: "people", className: "xl:hidden", node: <SuggestedPeople /> },
  { afterPost: 6, key: "communities", className: "lg:hidden", node: <TrendingCommunities /> },
  { afterPost: 9, key: "marketplace", className: "xl:hidden", node: <MarketplacePreview /> },
];

// With only a handful of posts the cards would never be reached, so they
// go straight after the last post instead.
const slotAfter = (afterPost: number, postCount: number) => Math.min(afterPost, postCount);

export default function FeedCenter() {
  const myId = useAuthStore((state) => state.user?.id);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts({ sort: "desc" });

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];
  const isQuiet = !isLoading && !isError && posts.length < 3;

  // Cheap check for newer posts every 45s while the tab is open (only the
  // newest post's id). Its own query key, so posting yourself (which
  // invalidates ["posts"]) doesn't touch it.
  const { data: latest } = useQuery({
    queryKey: ["feed-latest"],
    queryFn: () => getPosts({ page: 1, limit: 1, sort: "desc" }),
    select: (response) => response.data.posts[0],
    refetchInterval: 45_000,
    refetchIntervalInBackground: false,
    enabled: !isLoading,
  });
  const hasNewPosts =
    !!latest &&
    !!posts[0] &&
    latest.id !== posts[0].id &&
    latest.authorId !== myId &&
    new Date(latest.createdAt) > new Date(posts[0].createdAt);

  const refresh = () => refetch();
  const { pull, refreshing, ready } = usePullToRefresh(refresh);

  const showNewPosts = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  };

  const interstitialsAt = (index: number) =>
    INTERSTITIALS.filter((slot) => slotAfter(slot.afterPost, posts.length) === index);

  return (
    <div className="space-y-6">
      {/* Pull-to-refresh indicator (touch screens). */}
      {(pull > 0 || refreshing) && (
        <div
          className="flex items-end justify-center overflow-hidden transition-[height] duration-150"
          style={{ height: refreshing ? 44 : pull * 0.6 }}
        >
          <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-violet-600 shadow-sm dark:text-violet-400">
            {refreshing ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={16} style={{ transform: `rotate(${pull * 3}deg)` }} className={ready ? "" : "opacity-60"} />
            )}
          </span>
        </div>
      )}

      {/* "New posts" pill, floating under the navbar. */}
      {hasNewPosts && (
        <div className="pointer-events-none sticky top-20 z-30 -mb-6 flex justify-center">
          <button
            onClick={showNewPosts}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(76,29,149,0.7)] transition hover:brightness-110"
          >
            <ArrowUp size={14} /> New posts
          </button>
        </div>
      )}

      <Stories />

      <CreatePostCard />

      {isLoading && <PostListSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-[14px] text-red-500">
          Couldn&apos;t load the feed. Please try again.
        </div>
      )}

      {isQuiet && <QuietFeedWelcome hasPosts={posts.length > 0} />}

      {!isLoading && !isError && (
        <div className="space-y-5">
          {interstitialsAt(0).map((slot) => (
            <div key={slot.key} className={slot.className}>{slot.node}</div>
          ))}
          {posts.map((post, i) => (
            <Fragment key={post.id}>
              <PostCard post={post} />
              {interstitialsAt(i + 1).map((slot) => (
                <div key={slot.key} className={slot.className}>{slot.node}</div>
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-2xl border border-line bg-surface py-3 text-[13.5px] font-medium text-violet-600 dark:text-violet-400 transition-colors hover:bg-surface-2 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}

// Shown while the feed is nearly empty (new users, or a quiet network) so the
// page offers something to do instead of a bare "no posts" line.
function QuietFeedWelcome({ hasPosts }: { hasPosts: boolean }) {
  const actions = [
    { href: "/communities", icon: Users2, label: "Join communities", body: "Find people who love what you love" },
    { href: "/marketplace", icon: ShoppingBag, label: "Browse the marketplace", body: "Shop from sellers you can trust" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-surface to-indigo-50 p-6 dark:border-violet-500/20 dark:from-violet-500/10 dark:via-surface dark:to-indigo-500/10">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
        <Sparkles size={20} />
      </span>
      <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-[22px] italic text-ink">
        {hasPosts ? "Your feed is just getting started" : "Your feed is waiting for you"}
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Follow people and join communities - their posts will show up here. Or share the first post above.
      </p>

      {/* Stacked: the feed column is narrow next to the desktop sidebars. */}
      <div className="mt-5 grid gap-3">
        {actions.map(({ href, icon: Icon, label, body }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint text-violet-600 dark:text-violet-400">
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold text-ink">{label}</span>
              <span className="block truncate text-[12px] text-muted">{body}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
