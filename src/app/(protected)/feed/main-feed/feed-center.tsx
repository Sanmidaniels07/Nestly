"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, Users2 } from "lucide-react";

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
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts({ sort: "desc" });

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];
  const isQuiet = !isLoading && !isError && posts.length < 3;

  const interstitialsAt = (index: number) =>
    INTERSTITIALS.filter((slot) => slotAfter(slot.afterPost, posts.length) === index);

  return (
    <div className="space-y-6">
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
