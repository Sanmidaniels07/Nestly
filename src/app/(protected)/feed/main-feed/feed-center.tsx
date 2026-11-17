"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, ShoppingBag, Sparkles, Users2 } from "lucide-react";

import { usePullToRefresh } from "@/src/hooks/use-pull-to-refresh";
import { useShoppingFeed } from "@/src/hooks/use-shopping-feed";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import HighlightsRail from "./shopping/highlights-rail";
import PurchaseCard from "./shopping/purchase-card";
import DropCard from "./shopping/drop-card";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";
import SuggestedPeople from "../right-sidebar/suggested-friends";
import MarketplacePreview from "../right-sidebar/marketplace-preview";
import TrendingCommunities from "../left-sidebar/trending-communities";
import { FeedItem } from "@/src/types/shopping-feed";

// The shopping feed: what's actually happening on Nestly - purchases people
// made and loved, new items from stores you follow, posts (ones that show
// something you can buy first) - with what's happening right now on top.

// On smaller screens the sidebars are hidden, so their best cards are woven
// into the feed (Instagram-style). Each hides itself once its sidebar shows.
const INTERSTITIALS = [
  { after: 3, key: "people", className: "xl:hidden", node: <SuggestedPeople /> },
  { after: 7, key: "communities", className: "lg:hidden", node: <TrendingCommunities /> },
  { after: 11, key: "marketplace", className: "xl:hidden", node: <MarketplacePreview /> },
];

function FeedEntry({ item }: { item: FeedItem }) {
  if (item.type === "PURCHASE") return <PurchaseCard item={item} />;
  if (item.type === "DROP") return <DropCard item={item} />;
  return <PostCard post={item.post} />;
}

export default function FeedCenter() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useShoppingFeed();

  const items = data?.pages.flatMap((page) => page.data.items) ?? [];
  const highlights = data?.pages[0]?.data.highlights ?? null;
  const isQuiet = !isLoading && !isError && items.length < 3;

  const { pull, refreshing, ready } = usePullToRefresh(() => refetch());

  // Keep going as you scroll: load the next page a screen before the end.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const slotsAfter = (count: number) => INTERSTITIALS.filter((slot) => Math.min(slot.after, items.length) === count);

  return (
    <div className="space-y-6">
      {/* Pull-to-refresh indicator (touch screens). */}
      {(pull > 0 || refreshing) && (
        <div className="flex items-end justify-center overflow-hidden transition-[height] duration-150" style={{ height: refreshing ? 44 : pull * 0.6 }}>
          <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-violet-600 shadow-sm dark:text-violet-400">
            {refreshing ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={16} style={{ transform: `rotate(${pull * 3}deg)` }} className={ready ? "" : "opacity-60"} />}
          </span>
        </div>
      )}

      <Stories />

      {highlights && <HighlightsRail highlights={highlights} />}

      <CreatePostCard />

      {isLoading && <PostListSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-[14px] text-red-500">Couldn&apos;t load the feed. Please try again.</div>
      )}

      {isQuiet && <QuietFeedWelcome hasItems={items.length > 0} />}

      {!isLoading && !isError && items.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-baseline justify-between gap-3 px-0.5">
            <h2 className="whitespace-nowrap font-[family-name:var(--font-fraunces)] text-[22px] leading-none text-ink">Your feed</h2>
            <span className="hidden truncate font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-subtle sm:block">Real buys · new drops · posts</span>
          </div>
          {slotsAfter(0).map((slot) => (
            <div key={slot.key} className={slot.className}>
              {slot.node}
            </div>
          ))}
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <FeedEntry item={item} />
              {slotsAfter(index + 1).map((slot) => (
                <div key={slot.key} className={slot.className}>
                  {slot.node}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      )}

      <div ref={sentinel} aria-hidden className="h-px" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <Loader2 size={20} className="animate-spin text-violet-600" />
        </div>
      )}
      {!hasNextPage && items.length > 6 && (
        <p className="py-4 text-center text-[12.5px] text-subtle">You&apos;re all caught up ✨ Follow more stores and people to see more here.</p>
      )}
    </div>
  );
}

// Shown while the feed is nearly empty (new users, or a quiet network) so the
// page offers something to do instead of a bare "nothing here".
function QuietFeedWelcome({ hasItems }: { hasItems: boolean }) {
  const actions = [
    { href: "/marketplace", icon: ShoppingBag, label: "Follow stores you love", body: "Their new items and lives show up here" },
    { href: "/communities", icon: Users2, label: "Find your people", body: "See what friends buy and recommend" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-surface to-amber-50 p-6 dark:border-violet-500/20 dark:from-violet-500/10 dark:via-surface dark:to-amber-500/5">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white">
        <Sparkles size={20} />
      </span>
      <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-[22px] text-ink">
        {hasItems ? "Your feed is just getting started" : "Your feed is waiting for you"}
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        This is where you see what friends actually buy and love, new drops from shops you follow, and who&apos;s live right now.
      </p>
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
