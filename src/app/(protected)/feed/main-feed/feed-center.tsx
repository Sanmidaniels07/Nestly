"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Loader2, MapPin, RefreshCw, ShoppingBag, Sparkles, Store, Users2 } from "lucide-react";

import { usePullToRefresh } from "@/src/hooks/use-pull-to-refresh";
import { useSetFeedArea, useShoppingFeed } from "@/src/hooks/use-shopping-feed";
import { stateLabel } from "@/src/lib/locations";

import Stories from "./stories";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import HighlightsRail from "./shopping/highlights-rail";
import PurchaseCard from "./shopping/purchase-card";
import DropCard from "./shopping/drop-card";
import AreaPicker from "./shopping/area-picker";
import { PostListSkeleton } from "@/src/components/skeletons/post-card-skeleton";
import SuggestedPeople from "../right-sidebar/suggested-friends";
import MarketplacePreview from "../right-sidebar/marketplace-preview";
import TrendingCommunities from "../left-sidebar/trending-communities";
import { FeedArea, FeedItem } from "@/src/types/shopping-feed";

type FeedMode = "for-you" | "near";
const MODE_KEY = "nestly:feed-mode";

// Which feed was open last time - a per-device convenience, so it's fine if
// storage is blocked.
let chosenMode: FeedMode | null = null;
const modeListeners = new Set<() => void>();
const readMode = (): FeedMode => {
  if (chosenMode) return chosenMode;
  try {
    return window.localStorage.getItem(MODE_KEY) === "near" ? "near" : "for-you";
  } catch {
    return "for-you";
  }
};
const subscribeMode = (listener: () => void) => {
  modeListeners.add(listener);
  return () => modeListeners.delete(listener);
};

const useFeedMode = () => {
  // Server render and first paint use "For you"; the saved choice applies right after.
  const mode = useSyncExternalStore(subscribeMode, readMode, () => "for-you" as FeedMode);
  const choose = (next: FeedMode) => {
    chosenMode = next;
    try {
      window.localStorage.setItem(MODE_KEY, next);
    } catch {}
    modeListeners.forEach((listener) => listener());
  };
  return [mode, choose] as const;
};

function ModeSwitch({ mode, onChange }: { mode: FeedMode; onChange: (mode: FeedMode) => void }) {
  const tab = (value: FeedMode, label: React.ReactNode) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === value}
      onClick={() => onChange(value)}
      className={`flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition ${
        mode === value ? "bg-surface text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="tablist" aria-label="Feed" className="inline-flex shrink-0 rounded-full bg-surface-2 p-1 ring-1 ring-line">
      {tab("for-you", "For you")}
      {tab("near", <><MapPin size={13} /> Near me</>)}
    </div>
  );
}

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
  const [mode, setMode] = useFeedMode();
  const near = mode === "near";
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useShoppingFeed(near);
  const [picking, setPicking] = useState(false);

  const items = data?.pages.flatMap((page) => page.data.items) ?? [];
  const highlights = data?.pages[0]?.data.highlights ?? null;
  // Near me: the area the server used (null = it doesn't know where you are yet).
  const area = near && data ? (data.pages[0]?.data.area ?? null) : undefined;
  const isQuiet = !near && !isLoading && !isError && items.length < 3;

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

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 px-0.5">
          <h2 className="whitespace-nowrap font-[family-name:var(--font-fraunces)] text-[22px] leading-none text-ink">Your feed</h2>
          <ModeSwitch mode={mode} onChange={setMode} />
        </div>
        {area && (
          <div className="flex items-center gap-2 px-0.5 text-[12.5px] text-muted">
            <MapPin size={14} className="shrink-0 text-violet-600 dark:text-violet-400" />
            <span className="min-w-0 truncate">
              Near <span className="font-semibold text-ink">{area.label}</span>
              {area.storeCount > 0 && <> · {area.storeCount} {area.storeCount === 1 ? "shop" : "shops"}</>}
            </span>
            <button type="button" onClick={() => setPicking(true)} className="shrink-0 font-semibold text-violet-600 hover:underline dark:text-violet-400">
              Change
            </button>
          </div>
        )}
      </div>

      {isQuiet && <QuietFeedWelcome hasItems={items.length > 0} />}

      {near && !isLoading && !isError && area === null && <AskForArea onPick={() => setPicking(true)} />}

      {near && !isLoading && !isError && area && items.length === 0 && (
        <NothingNear area={area} onChange={() => setPicking(true)} onForYou={() => setMode("for-you")} />
      )}

      {picking && <AreaPicker current={area ?? null} onClose={() => setPicking(false)} />}

      {!isLoading && !isError && items.length > 0 && (
        <div className="space-y-5">
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
        <p className="py-4 text-center text-[12.5px] text-subtle">
          {near ? "That's everything near you for now ✨ Check back soon." : "You're all caught up ✨ Follow more stores and people to see more here."}
        </p>
      )}
    </div>
  );
}

// Near me, but we don't know where the viewer is yet.
function AskForArea({ onPick }: { onPick: () => void }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="bg-gradient-to-br from-violet-500/10 via-transparent to-amber-400/10 px-6 py-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
          <MapPin size={26} />
        </span>
        <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-[22px] text-ink">Where are you?</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-muted">
          Tell us your area and we&apos;ll show shops that are based there or deliver to you - their new items, what people bought and their lives.
        </p>
        <button
          type="button"
          onClick={onPick}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[14px] font-semibold text-white hover:brightness-110"
        >
          <MapPin size={16} /> Choose my area
        </button>
      </div>
    </div>
  );
}

// Near me, area known, but no shop serves it yet.
function NothingNear({ area, onChange, onForYou }: { area: FeedArea; onChange: () => void; onForYou: () => void }) {
  const { mutate: save, isPending } = useSetFeedArea();
  return (
    <div className="rounded-3xl border border-line bg-surface px-6 py-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-muted">
        <Store size={22} />
      </span>
      <h3 className="mt-3 font-[family-name:var(--font-fraunces)] text-[20px] text-ink">No shops near {area.label} yet</h3>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted">Nestly is growing - try a wider area, or see what&apos;s popular everywhere.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {area.area && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => save({ state: area.state, area: null })}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />} Try all of {stateLabel(area.state)}
          </button>
        )}
        <button type="button" onClick={onChange} className="h-10 rounded-xl border border-line px-4 text-[13px] font-semibold text-ink hover:bg-surface-2">
          Change area
        </button>
        <button type="button" onClick={onForYou} className="h-10 rounded-xl px-4 text-[13px] font-semibold text-muted hover:text-ink">
          Back to For you
        </button>
      </div>
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
