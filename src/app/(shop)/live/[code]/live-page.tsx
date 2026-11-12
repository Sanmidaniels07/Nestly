"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  BellRing,
  CalendarPlus,
  Clock,
  Loader2,
  Radio,
  Share2,
  ShoppingBag,
  Store,
  Video,
  X,
} from "lucide-react";

import { useLive, useLiveReminder } from "@/src/hooks/use-lives";
import { useLiveRoom } from "@/src/hooks/use-live-room";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";
import { useAuthStore } from "@/src/store/auth-store";
import { getWatchToken, liveCalendarUrl } from "@/src/services/live.services";
import { reconnectLiveSocket } from "@/src/lib/live-socket";
import { rememberReturnTo } from "@/src/lib/return-to";
import Skeleton from "@/src/components/ui/skeleton";
import { ViewerVideo } from "@/src/components/live/live-video";
import LiveBuySheet from "@/src/components/live/live-buy-sheet";
import {
  FloatingHearts,
  LiveBadge,
  LiveChatInput,
  LiveChatList,
  LivePrice,
  PinnedProduct,
  PurchaseTicker,
  liveShareUrl,
  liveWhen,
} from "@/src/components/live/live-ui";
import { ApiResponse } from "@/src/types/api";
import { LiveProduct, PublicLive, WatchToken } from "@/src/types/live";

interface Props {
  code: string;
  initialLive?: ApiResponse<PublicLive>;
}

// Guests watch this long before being asked to sign up.
const PREVIEW_SECONDS = 60;

export default function LivePage({ code, initialLive }: Props) {
  const { data: live, isLoading, isError } = useLive(code, initialLive);

  if (isLoading && !live) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="aspect-video w-full rounded-3xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !live) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">This live doesn&apos;t exist any more</p>
        <p className="mt-1.5 text-[13.5px] text-muted">The seller may have removed it. Find more sellers on Nestly.</p>
        <Link href="/marketplace" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Browse Nestly
        </Link>
      </div>
    );
  }

  if (live.status === "LIVE") return <LiveNow live={live} />;
  return <LiveInfo live={live} />;
}

// ---------------------------------------------------------------------------
// Before / after the live
// ---------------------------------------------------------------------------

function StoreLine({ live }: { live: PublicLive }) {
  return (
    <Link href={`/marketplace/seller/${live.store.slug}`} className="flex min-w-0 items-center gap-2.5">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
        {live.store.logo ? <Image src={live.store.logo} alt="" fill sizes="40px" className="object-cover" /> : <Store size={17} />}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[14px] font-semibold text-ink">
          <span className="truncate">{live.store.name}</span>
          {live.store.isVerified && <BadgeCheck size={15} className="shrink-0 text-violet-600" aria-label="Verified business" />}
        </span>
        {(live.store.city || live.store.state) && (
          <span className="block truncate text-[12px] text-muted">{[...new Set([live.store.city, live.store.state].filter(Boolean))].join(", ")}</span>
        )}
      </span>
    </Link>
  );
}

function useCountdownSeconds(targetIso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const left = Math.max(0, Math.floor((new Date(targetIso).getTime() - now) / 1000));
  return { days: Math.floor(left / 86400), hours: Math.floor((left % 86400) / 3600), minutes: Math.floor((left % 3600) / 60), seconds: left % 60, done: left === 0 };
}

function Countdown({ to }: { to: string }) {
  const { days, hours, minutes, seconds, done } = useCountdownSeconds(to);
  if (done) return <p className="text-[14px] font-semibold text-violet-700 dark:text-violet-300">Starting any moment - stay on this page.</p>;
  const parts = [
    ...(days ? [{ value: days, label: "days" }] : []),
    { value: hours, label: "hrs" },
    { value: minutes, label: "mins" },
    { value: seconds, label: "secs" },
  ];
  return (
    <div className="flex gap-2">
      {parts.map((part) => (
        <span key={part.label} className="flex w-16 flex-col items-center rounded-2xl bg-surface-sunken py-2.5">
          <span className="font-[family-name:var(--font-mono)] text-[22px] font-semibold text-ink">{String(part.value).padStart(2, "0")}</span>
          <span className="text-[10.5px] uppercase tracking-wide text-muted">{part.label}</span>
        </span>
      ))}
    </div>
  );
}

function ShareButton({ live }: { live: PublicLive }) {
  const share = async () => {
    const url = liveShareUrl(live.code, live.referralCode);
    const text = `${live.store.name} is going live on Nestly: ${live.title}`;
    try {
      if (navigator.share) return await navigator.share({ title: live.title, text, url });
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      // Share sheet closed.
    }
  };
  return (
    <button type="button" onClick={share} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink-2 hover:border-violet-300">
      <Share2 size={16} /> Share
    </button>
  );
}

function LiveInfo({ live }: { live: PublicLive }) {
  const { isLoggedIn } = useSession();
  const requireLogin = useRequireLogin();
  const { mutate: setReminder, isPending } = useLiveReminder(live.code);
  const [buying, setBuying] = useState<string | null>(null);
  const upcoming = live.status === "SCHEDULED";
  const shoppable = live.status === "ENDED" && live.discountActive;

  const remind = () => {
    if (!requireLogin("Create a free account and we'll remind you before the live starts.")) return;
    setReminder(!live.isInterested);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:pt-8">
      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="relative aspect-video bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600">
          {live.coverImage && <Image src={live.coverImage} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur">
            {upcoming ? <Radio size={13} /> : <Clock size={13} />}
            {upcoming ? "Upcoming live" : live.status === "CANCELLED" ? "Cancelled" : "This live has ended"}
          </span>
          {!live.coverImage && <Video size={48} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70" />}
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StoreLine live={live} />
            {upcoming && (
              <span className="text-[12.5px] text-muted">
                <BellRing size={13} className="mr-1 inline" />
                {live.interestedCount.toLocaleString()} waiting
              </span>
            )}
          </div>

          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] leading-tight text-ink sm:text-[32px]">{live.title}</h1>
            <p className="mt-1.5 text-[14px] font-semibold text-violet-700 dark:text-violet-300">{liveWhen(live.scheduledAt)} (Nigeria time)</p>
            {live.description && <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink-2">{live.description}</p>}
          </div>

          {upcoming && <Countdown to={live.scheduledAt} />}

          {live.status === "CANCELLED" && (
            <p className="rounded-xl bg-surface-sunken p-3.5 text-[13px] text-ink-2">
              {live.endReason === "NOT_STARTED" ? "This live didn't go ahead." : "The seller cancelled this live."} Follow {live.store.name} to hear about their next one.
            </p>
          )}

          {live.isOwner ? (
            <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-500/5">
              <p className="text-[14px] font-semibold text-ink">This is your live</p>
              <p className="mt-1 text-[13px] text-muted">Share this page so people tap &ldquo;Remind me&rdquo;. Go live from your studio.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/marketplace/live/${live.id}`} className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-[13.5px] font-semibold text-white">
                  <Video size={16} /> Open studio
                </Link>
                <ShareButton live={live} />
              </div>
            </div>
          ) : (
            upcoming && (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <button
                  type="button"
                  onClick={remind}
                  disabled={isPending}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold ${
                    live.isInterested
                      ? "border border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                  }`}
                >
                  {isPending ? <Loader2 size={17} className="animate-spin" /> : live.isInterested ? <BellRing size={17} /> : <Bell size={17} />}
                  {live.isInterested ? "You'll be reminded" : isLoggedIn ? "Remind me" : "Remind me - sign up free"}
                </button>
                <a href={liveCalendarUrl(live.code)} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink-2 hover:border-violet-300">
                  <CalendarPlus size={16} /> Add to calendar
                </a>
                <ShareButton live={live} />
              </div>
            )
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-[15px] font-semibold text-ink">
          {upcoming ? "What's coming in this live" : "Products from this live"}
          {upcoming && live.products.some((p) => p.discountPercent) && <span className="ml-2 text-[12.5px] font-medium text-rose-600">Live-only prices during the live</span>}
        </h2>
        <ProductGrid
          products={live.products}
          upcoming={upcoming}
          onBuy={shoppable && !live.isOwner ? (id) => requireLogin("Log in or create a free account to buy.") && setBuying(id) : undefined}
        />
      </section>

      {buying && <LiveBuySheet live={live} productId={buying} onClose={() => setBuying(null)} />}
    </div>
  );
}

function ProductGrid({ products, upcoming, onBuy }: { products: LiveProduct[]; upcoming: boolean; onBuy?: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
          <Link href={`/marketplace/product/${product.slug}`} className="relative block aspect-square bg-surface-sunken">
            {product.image && <Image src={product.image} alt={product.title} fill sizes="(min-width: 640px) 240px, 50vw" className="object-cover" />}
            {product.discountPercent && (
              <span className="absolute left-2 top-2 rounded-md bg-rose-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {upcoming ? `${product.discountPercent}% off live` : `-${product.discountPercent}%`}
              </span>
            )}
          </Link>
          <div className="space-y-1 p-3">
            <p className="line-clamp-2 text-[13px] font-semibold text-ink">{product.title}</p>
            <LivePrice product={product} size="sm" />
            {onBuy && (
              <button type="button" onClick={() => onBuy(product.id)} disabled={!product.available} className="mt-1.5 h-9 w-full rounded-xl bg-violet-600 text-[12.5px] font-semibold text-white disabled:bg-zinc-400">
                {product.available ? "Buy at live price" : "Sold out"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live now
// ---------------------------------------------------------------------------

/** Seconds of preview a guest has left on this live (remembered across refreshes). */
function useGuestPreview(code: string, active: boolean) {
  const key = `nestly:live-preview:${code}`;
  const [left, setLeft] = useState(PREVIEW_SECONDS);

  useEffect(() => {
    if (!active) return;
    let started = Date.now();
    try {
      const saved = Number(localStorage.getItem(key));
      if (saved && Date.now() - saved < 12 * 60 * 60 * 1000) started = saved;
      else localStorage.setItem(key, String(started));
    } catch {
      // Storage blocked - the preview restarts on refresh, that's fine.
    }
    const tick = () => setLeft(Math.max(0, PREVIEW_SECONDS - Math.floor((Date.now() - started) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [active, key]);

  return left;
}

function LiveNow({ live }: { live: PublicLive }) {
  const queryClient = useQueryClient();
  const { isLoggedIn, isHydrated } = useSession();
  const myUserId = useAuthStore((state) => state.user?.id ?? null);
  const requireLogin = useRequireLogin();
  const [video, setVideo] = useState<WatchToken | null>(null);
  const [videoError, setVideoError] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  const guest = isHydrated && !isLoggedIn;
  const previewLeft = useGuestPreview(live.code, guest);
  const gated = guest && previewLeft <= 0;

  const refetch = useCallback(() => queryClient.invalidateQueries({ queryKey: ["lives", "public", live.code] }), [queryClient, live.code]);

  const room = useLiveRoom({
    liveId: live.id,
    initialMessages: live.messages,
    initialPinned: live.pinnedProductId,
    initialViewers: live.viewers,
    myUserId,
    onStatus: () => refetch(),
  });

  // A guest who logs in mid-live: reconnect so chat knows who they are.
  useEffect(() => {
    if (isLoggedIn) reconnectLiveSocket();
  }, [isLoggedIn]);

  // Full screen while watching.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || gated || live.isOwner) return;
    let cancelled = false;
    getWatchToken(live.code)
      .then((response) => !cancelled && setVideo(response.data))
      .catch(() => !cancelled && setVideoError("Couldn't load the video. Refresh to try again."));
    return () => {
      cancelled = true;
    };
  }, [isHydrated, gated, live.code, live.isOwner, isLoggedIn]);

  const products = useMemo(
    () => live.products.map((product) => (room.stock[product.id] !== undefined ? { ...product, stock: room.stock[product.id] } : product)),
    [live.products, room.stock]
  );
  const pinned = products.find((product) => product.id === room.pinnedProductId) ?? null;

  const buy = (productId: string) => {
    if (live.isOwner) return;
    if (!requireLogin("Log in or create a free account to buy at the live price.")) return;
    setBuying(productId);
  };

  const chatBlocked = live.isOwner
    ? { label: "Chat from your studio" }
    : !isLoggedIn
      ? { label: "Log in to chat with the seller", action: () => requireLogin("Log in or create a free account to chat.") }
      : room.banned || live.isBanned
        ? { label: "The seller turned off chat for you" }
        : null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-center bg-black text-white">
      <div className="relative h-full w-full max-w-[calc(100dvh*9/16)] overflow-hidden lg:max-w-[min(480px,calc(100dvh*9/16))]">
        {live.isOwner ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-violet-900 to-black px-8 text-center">
            <Video size={32} />
            <p className="text-[15px] font-semibold">You&apos;re live</p>
            <p className="text-[13px] text-white/70">Your camera and controls are in your studio.</p>
            <Link href={`/marketplace/live/${live.id}`} className="mt-2 rounded-xl bg-white px-5 py-2.5 text-[13.5px] font-semibold text-violet-700">
              Open studio
            </Link>
          </div>
        ) : gated ? (
          <GuestGate live={live} />
        ) : video ? (
          <ViewerVideo url={video.url} token={video.token} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
            {videoError ? <p className="px-8 text-center text-[13.5px]">{videoError}</p> : <Loader2 size={26} className="animate-spin" />}
          </div>
        )}

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2">
            <Link href="/marketplace" aria-label="Leave the live" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur">
              <ArrowLeft size={18} />
            </Link>
            <Link href={`/marketplace/seller/${live.store.slug}`} className="flex min-w-0 items-center gap-2 rounded-full bg-black/40 py-1 pl-1 pr-3 backdrop-blur">
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500">
                {live.store.logo ? <Image src={live.store.logo} alt="" fill sizes="32px" className="object-cover" /> : <Store size={15} />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold">{live.store.name}</span>
                <span className="block truncate text-[11px] text-white/70">{live.title}</span>
              </span>
            </Link>
            <span className="ml-auto shrink-0">
              <LiveBadge viewers={room.viewers} />
            </span>
          </div>
          {guest && !gated && (
            <p className="mt-2 inline-block rounded-full bg-black/45 px-3 py-1 text-[11.5px] backdrop-blur">
              Free preview: {previewLeft}s left ·{" "}
              <button type="button" onClick={() => requireLogin("Create a free account to keep watching.")} className="font-semibold underline">
                Sign up to keep watching
              </button>
            </p>
          )}
        </div>

        {!gated && <FloatingHearts hearts={room.hearts} />}

        {/* Bottom: ticker, chat, pinned product, input */}
        {!gated && (
          <div className="absolute inset-x-0 bottom-0 z-20 space-y-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-16">
            <PurchaseTicker purchase={room.purchase} />
            <LiveChatList messages={room.messages} />
            {pinned && <PinnedProduct product={pinned} stock={room.stock[pinned.id]} onBuy={live.isOwner ? undefined : () => buy(pinned.id)} />}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowProducts(true)}
                className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-violet-700"
              >
                <ShoppingBag size={16} /> {products.length}
              </button>
              <div className="min-w-0 flex-1">
                <LiveChatInput onSend={room.sendChat} blocked={chatBlocked} onHeart={room.sendHeart} />
              </div>
            </div>
          </div>
        )}

        {showProducts && (
          <ProductsDrawer
            products={products}
            pinnedId={room.pinnedProductId}
            discountActive={live.discountActive}
            onClose={() => setShowProducts(false)}
            onBuy={live.isOwner ? undefined : (id) => buy(id)}
          />
        )}
      </div>

      {buying && <LiveBuySheet live={live} productId={buying} onClose={() => setBuying(null)} />}
    </div>
  );
}

function ProductsDrawer({
  products,
  pinnedId,
  discountActive,
  onClose,
  onBuy,
}: {
  products: LiveProduct[];
  pinnedId: string | null;
  discountActive: boolean;
  onClose: () => void;
  onBuy?: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-end bg-black/40" onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()} className="max-h-[70%] w-full overflow-y-auto rounded-t-3xl bg-canvas p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px] font-semibold">
            Products in this live{discountActive && products.some((p) => p.discountPercent) && <span className="ml-2 text-[12px] font-medium text-rose-600">Live prices on now</span>}
          </p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className={`flex items-center gap-3 rounded-2xl border p-2.5 ${product.id === pinnedId ? "border-violet-400 bg-violet-50/60 dark:bg-violet-500/10" : "border-line bg-surface"}`}>
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                {product.image && <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold">{product.title}</span>
                <LivePrice product={product} size="sm" />
                {product.id === pinnedId && <span className="block text-[11px] font-semibold text-violet-600">Showing now</span>}
              </span>
              {onBuy && (
                <button
                  type="button"
                  onClick={() => onBuy(product.id)}
                  disabled={!product.available || product.stock <= 0}
                  className="h-9 shrink-0 rounded-xl bg-violet-600 px-3.5 text-[12.5px] font-semibold text-white disabled:bg-zinc-400"
                >
                  {product.available && product.stock > 0 ? "Buy" : "Sold out"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** After the free preview: sign up (or log in) to keep watching. */
function GuestGate({ live }: { live: PublicLive }) {
  const path = `/live/${live.code}`;
  useEffect(() => {
    rememberReturnTo(path);
  }, [path]);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {live.coverImage && <Image src={live.coverImage} alt="" fill sizes="480px" className="scale-110 object-cover blur-xl brightness-50" />}
      {!live.coverImage && <div className="absolute inset-0 bg-gradient-to-b from-violet-800 to-black" />}
      <div className="relative z-10 mx-6 max-w-sm rounded-3xl bg-white/95 p-6 text-center text-ink shadow-2xl dark:bg-zinc-900/95">
        <span className="mx-auto mb-3 flex w-fit"><LiveBadge /></span>
        <p className="font-[family-name:var(--font-fraunces)] text-[22px] leading-tight">Enjoying the live?</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Create a free Nestly account to keep watching {live.store.name}, chat and shop the live deals. It takes a minute - or use Google.
        </p>
        <Link
          href={`/signup?returnTo=${encodeURIComponent(path)}`}
          className="mt-5 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14.5px] font-semibold text-white"
        >
          Sign up free to keep watching
        </Link>
        <Link href={`/login?returnTo=${encodeURIComponent(path)}`} className="mt-2 flex h-11 items-center justify-center rounded-xl border border-line text-[13.5px] font-semibold text-ink-2">
          I already have an account
        </Link>
      </div>
    </div>
  );
}
