"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  Pin,
  PinOff,
  Radio,
  RefreshCw,
  Share2,
  ShoppingBag,
  SwitchCamera,
  UserPlus,
  Users,
} from "lucide-react";

import { useEndLive, useLive, useLiveSummary, useMyLives, usePinLiveProduct, useBanLiveViewer, useRemoveLiveMessage } from "@/src/hooks/use-lives";
import { useLiveRoom } from "@/src/hooks/use-live-room";
import { useAuthStore } from "@/src/store/auth-store";
import { getHostToken, startLive } from "@/src/services/live.services";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import { HostVideo, HostVideoHandle } from "@/src/components/live/live-video";
import { FloatingHearts, LiveBadge, LiveChatInput, LiveChatList, LivePrice, PurchaseTicker, liveShareUrl, liveWhen } from "@/src/components/live/live-ui";
import { LiveVideo, SellerLive } from "@/src/types/live";
import { ApiErrorResponse } from "@/src/types/api";
import { AxiosError } from "axios";

// The seller's live studio: camera preview, go live, pin products, read and
// moderate chat, end the live - then the summary.

export default function LiveStudioPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMyLives();
  const live = data?.lives.find((item) => item.id === id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-8">
        <Skeleton className="aspect-[9/16] w-full rounded-3xl" />
      </div>
    );
  }
  if (!live) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">Live not found</p>
        <Link href="/settings/marketplace?tab=lives" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Back to your lives
        </Link>
      </div>
    );
  }
  if (live.status === "ENDED") return <LiveSummaryView id={live.id} />;
  if (live.status === "CANCELLED") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[16px] font-semibold text-ink">This live was cancelled</p>
        <Link href="/settings/marketplace?tab=lives" className="mt-6 inline-block text-[13.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
          Schedule a new one
        </Link>
      </div>
    );
  }
  return <Studio live={live} />;
}

/** The current time, ticking every second. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

function Studio({ live }: { live: SellerLive }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const myUserId = useAuthStore((state) => state.user?.id ?? null);
  const videoRef = useRef<HostVideoHandle>(null);
  const [session, setSession] = useState<LiveVideo | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(live.startedAt);
  const [endsAt, setEndsAt] = useState<string | null>(live.endsAt);
  const [connection, setConnection] = useState<"offline" | "connecting" | "live" | "reconnecting">("offline");
  const [starting, setStarting] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [panel, setPanel] = useState<"chat" | "products">("products");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const { mutate: endLive, isPending: ending } = useEndLive();
  const { mutate: pin } = usePinLiveProduct();
  const { mutate: removeMessage } = useRemoveLiveMessage();
  const { mutate: ban } = useBanLiveViewer();
  // Chat history (public endpoint) so a refreshed studio still shows it.
  const { data: publicLive } = useLive(live.code);

  const isLive = !!session;
  const now = useNow();
  const elapsed = isLive && startedAt ? Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000)) : null;
  const secondsLeft = endsAt ? Math.max(0, Math.floor((new Date(endsAt).getTime() - now) / 1000)) : null;

  const room = useLiveRoom({
    liveId: live.id,
    initialMessages: publicLive?.messages ?? [],
    initialPinned: live.pinnedProductId,
    initialViewers: live.viewers,
    myUserId,
    onStatus: (status) => {
      if (status === "ENDED") {
        toast("Your live has ended", { icon: "🔴" });
        queryClient.invalidateQueries({ queryKey: ["lives", "me"] });
      }
    },
    onTimeWarning: (minutes) => toast(`${minutes} minute${minutes === 1 ? "" : "s"} left - wrap up your best deals!`, { icon: "⏰", duration: 8000 }),
  });

  // History arrives after the socket - fill it in once.
  const filled = useRef(false);
  useEffect(() => {
    if (publicLive && !filled.current) {
      filled.current = true;
      room.setMessages((current) => {
        const ids = new Set(current.map((m) => m.id));
        return [...publicLive.messages.filter((m) => !ids.has(m.id)), ...current];
      });
    }
  }, [publicLive, room]);

  // Already live (refresh / came back): reconnect the camera.
  useEffect(() => {
    if (live.status !== "LIVE") return;
    getHostToken(live.id)
      .then((response) => {
        setSession(response.data.video);
        setStartedAt(response.data.live.startedAt);
        setEndsAt(response.data.live.endsAt);
      })
      .catch(() => toast.error("Couldn't reconnect your live. Refresh to try again."));
  }, [live.id, live.status]);

  // Keep the phone screen on while live (the camera stops if it locks).
  useEffect(() => {
    if (!isLive || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const request = () =>
      navigator.wakeLock
        .request("screen")
        .then((sentinel) => (lock = sentinel))
        .catch(() => {});
    request();
    const onVisible = () => document.visibilityState === "visible" && request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, [isLive]);

  // Full screen studio.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const goLive = async () => {
    setStarting(true);
    try {
      const response = await startLive(live.id);
      setSession(response.data.video);
      setStartedAt(response.data.live.startedAt);
      setEndsAt(response.data.live.endsAt);
      queryClient.invalidateQueries({ queryKey: ["lives", "me"] });
      toast.success("You're live! Followers and people waiting have been told.");
    } catch (error) {
      toast.error((error as AxiosError<ApiErrorResponse>).response?.data.message ?? "Couldn't go live");
    } finally {
      setStarting(false);
    }
  };

  const finish = () =>
    endLive(live.id, {
      onSuccess: () => {
        setSession(null);
        setConfirmEnd(false);
        toast.success("Live ended");
      },
    });

  const share = async () => {
    const url = liveShareUrl(live.code, publicLive?.referralCode);
    try {
      if (navigator.share) return await navigator.share({ title: live.title, text: `I'm live on Nestly: ${live.title}`, url });
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      // closed
    }
  };

  const products = useMemo(
    () => live.products.map((product) => (room.stock[product.id] !== undefined ? { ...product, stock: room.stock[product.id] } : product)),
    [live.products, room.stock]
  );

  const togglePin = (productId: string) => {
    const next = room.pinnedProductId === productId ? null : productId;
    room.setPinnedProductId(next);
    pin({ id: live.id, productId: next });
  };

  const early = new Date(live.scheduledAt).getTime() - now > 60 * 60 * 1000;

  return (
    <div className="fixed inset-0 z-50 flex bg-black text-white">
      {/* Camera */}
      <div className="relative h-full w-full lg:max-w-[min(480px,calc(100dvh*9/16))] lg:shrink-0">
        <HostVideo ref={videoRef} session={session} onConnection={setConnection} onError={(message) => toast.error(message)} />

        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => (isLive ? setConfirmEnd(true) : router.push("/settings/marketplace?tab=lives"))}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur"
            >
              <ArrowLeft size={18} />
            </button>
            {isLive ? (
              <>
                <LiveBadge viewers={room.viewers} />
                {elapsed !== null && <span className="rounded-md bg-black/45 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[12px]">{clock(elapsed)}</span>}
                {connection === "reconnecting" && (
                  <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[11.5px] font-semibold text-black">
                    <RefreshCw size={12} className="animate-spin" /> Reconnecting
                  </span>
                )}
              </>
            ) : (
              <span className="truncate rounded-full bg-black/40 px-3 py-1.5 text-[12.5px] font-semibold backdrop-blur">Preview - only you can see this</span>
            )}
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={() => videoRef.current?.flipCamera()} aria-label="Switch camera" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur">
                <SwitchCamera size={17} />
              </button>
              <button
                type="button"
                onClick={() => {
                  videoRef.current?.setMicOn(!micOn);
                  setMicOn(!micOn);
                }}
                aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
                className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur ${micOn ? "bg-black/40" : "bg-rose-600"}`}
              >
                {micOn ? <Mic size={17} /> : <MicOff size={17} />}
              </button>
              <button type="button" onClick={share} aria-label="Share live link" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur">
                <Share2 size={17} />
              </button>
            </span>
          </div>
          {isLive && secondsLeft !== null && secondsLeft <= 5 * 60 && (
            <p className="mt-2 inline-block rounded-full bg-amber-500 px-3 py-1 text-[12px] font-semibold text-black">Ends in {clock(secondsLeft)}</p>
          )}
        </div>

        <FloatingHearts hearts={room.hearts} />

        <div className="absolute inset-x-0 bottom-0 z-20 space-y-2.5 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-16">
          {isLive ? (
            <>
              <PurchaseTicker purchase={room.purchase} />
              {/* Mobile: chat over the video. Desktop has the side panel. */}
              <div className="lg:hidden">
                <LiveChatList messages={room.messages} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {products.map((product) => (
                  <PinChip key={product.id} product={product} pinned={room.pinnedProductId === product.id} onToggle={() => togglePin(product.id)} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1 lg:hidden">
                  <LiveChatInput onSend={room.sendChat} placeholder="Reply to your viewers…" />
                </div>
                <button type="button" onClick={() => setConfirmEnd(true)} className="h-11 shrink-0 rounded-full bg-rose-600 px-4 text-[13.5px] font-semibold lg:w-full">
                  End live
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3 rounded-3xl bg-black/55 p-4 backdrop-blur">
              <div>
                <p className="text-[15px] font-semibold">{live.title}</p>
                <p className="text-[12.5px] text-white/70">
                  Scheduled for {liveWhen(live.scheduledAt)} · {live.interestedCount} waiting
                </p>
              </div>
              <ul className="space-y-1 text-[12.5px] text-white/80">
                <li>• Good light on your face and products, phone steady (upright).</li>
                <li>• Keep this screen open - the live stops if your phone locks.</li>
                <li>• Tap a product while live to show it to everyone with a Buy button.</li>
              </ul>
              <button
                type="button"
                onClick={goLive}
                disabled={starting || early}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 text-[15px] font-semibold disabled:opacity-60"
              >
                {starting ? <Loader2 size={18} className="animate-spin" /> : <Radio size={18} />}
                {early ? "You can go live from 1 hour before" : starting ? "Going live…" : "Go live now"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop side panel: chat + products */}
      <aside className="hidden min-w-0 flex-1 flex-col border-l border-white/10 bg-canvas text-ink lg:flex">
        <div className="flex border-b border-line">
          {(["products", "chat"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPanel(tab)}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-[13.5px] font-semibold ${panel === tab ? "border-b-2 border-violet-600 text-violet-700 dark:text-violet-300" : "text-muted"}`}
            >
              {tab === "products" ? <ShoppingBag size={15} /> : <MessageCircle size={15} />}
              {tab === "products" ? `Products (${products.length})` : `Chat (${room.messages.length})`}
            </button>
          ))}
        </div>
        {panel === "products" ? (
          <ul className="flex-1 space-y-2 overflow-y-auto p-4">
            {!isLive && <p className="mb-2 text-[12.5px] text-muted">Once you&apos;re live, tap Pin to show a product to everyone with a Buy button.</p>}
            {products.map((product) => (
              <li key={product.id} className={`flex items-center gap-3 rounded-2xl border p-2.5 ${room.pinnedProductId === product.id ? "border-violet-400 bg-violet-50/60 dark:bg-violet-500/10" : "border-line bg-surface"}`}>
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                  {product.image && <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold">{product.title}</span>
                  <LivePrice product={product} size="sm" />
                  <span className="block text-[11.5px] text-muted">{product.stock} in stock</span>
                </span>
                <button
                  type="button"
                  disabled={!isLive}
                  onClick={() => togglePin(product.id)}
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-semibold disabled:opacity-40 ${
                    room.pinnedProductId === product.id ? "bg-violet-600 text-white" : "border border-line text-ink-2"
                  }`}
                >
                  {room.pinnedProductId === product.id ? <PinOff size={14} /> : <Pin size={14} />}
                  {room.pinnedProductId === product.id ? "Unpin" : "Pin"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <LiveChatList
                variant="panel"
                messages={room.messages}
                onRemove={(message) => {
                  room.setMessages((current) => current.filter((m) => m.id !== message.id));
                  removeMessage({ id: live.id, messageId: message.id });
                }}
                onBan={(message) => {
                  if (window.confirm(`Block ${message.user.name} from chatting in this live? Their messages will be removed.`)) ban({ id: live.id, userId: message.user.id });
                }}
              />
            </div>
            <div className="border-t border-line p-3">
              <LiveChatInput variant="panel" placeholder="Reply to your viewers…" onSend={room.sendChat} blocked={isLive ? null : { label: "Chat opens when you go live" }} />
            </div>
          </div>
        )}
      </aside>

      {confirmEnd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6" onClick={() => setConfirmEnd(false)}>
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-3xl bg-canvas p-6 text-center text-ink">
            <p className="text-[16px] font-semibold">End your live?</p>
            <p className="mt-1.5 text-[13px] text-muted">Everyone watching will see that it&apos;s over. Live prices stay on for 30 more minutes.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmEnd(false)} className="h-11 rounded-xl border border-line text-[13.5px] font-semibold">
                Keep going
              </button>
              <button type="button" onClick={finish} disabled={ending} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 text-[13.5px] font-semibold text-white">
                {ending && <Loader2 size={15} className="animate-spin" />} End live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PinChip({ product, pinned, onToggle }: { product: SellerLive["products"][number]; pinned: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex shrink-0 items-center gap-2 rounded-2xl p-1.5 pr-3 text-left ${pinned ? "bg-violet-600" : "bg-black/45 backdrop-blur"}`}
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white/10">
        {product.image && <Image src={product.image} alt="" fill sizes="40px" className="object-cover" />}
      </span>
      <span className="max-w-[120px]">
        <span className="block truncate text-[12px] font-semibold">{product.title}</span>
        <span className="flex items-center gap-1 text-[11px] text-white/80">
          {pinned ? <PinOff size={11} /> : <Pin size={11} />} {pinned ? "Showing" : "Tap to show"}
        </span>
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// After the live
// ---------------------------------------------------------------------------

function LiveSummaryView({ id }: { id: string }) {
  const { data: summary, isLoading } = useLiveSummary(id);

  if (isLoading || !summary) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const stats = [
    { icon: Eye, label: "Most watching at once", value: summary.peakViewers.toLocaleString() },
    { icon: ShoppingBag, label: "Orders", value: summary.orders.toLocaleString() },
    { icon: Heart, label: "Sales", value: naira(summary.revenue) },
    { icon: MessageCircle, label: "Chat messages", value: summary.chatMessages.toLocaleString() },
    { icon: UserPlus, label: "New followers", value: summary.newFollowers.toLocaleString() },
    { icon: Users, label: "New members from your links", value: summary.signUps.toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6 sm:pt-8">
      <Link href="/settings/marketplace?tab=lives" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink">
        <ArrowLeft size={15} /> Your lives
      </Link>
      <p className="mt-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-violet-600">Live summary</p>
      <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">{summary.title}</h1>
      <p className="mt-1 text-[13px] text-muted">
        {summary.startedAt ? liveWhen(summary.startedAt) : liveWhen(summary.scheduledAt)} · {summary.durationMinutes} min
        {summary.endReason === "TIME_LIMIT" && " · ended at the 60-minute limit"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-surface p-4">
            <stat.icon size={17} className="text-violet-600 dark:text-violet-400" />
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[20px] font-semibold text-ink">{stat.value}</p>
            <p className="text-[12px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-[14.5px] font-semibold text-ink">What sold</h2>
        {summary.topProducts.length === 0 ? (
          <p className="mt-2 text-[13px] text-muted">No orders this time. Tip: announce your next live a few days ahead and share the link in your status and bio.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {summary.topProducts.map((product) => (
              <li key={product.productId} className="flex items-center justify-between py-2.5 text-[13.5px]">
                <span className="min-w-0 truncate text-ink">
                  {product.title} <span className="text-muted">× {product.units}</span>
                </span>
                <span className="shrink-0 font-[family-name:var(--font-mono)] font-semibold text-ink">{naira(product.revenue)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[12px] text-muted">Orders from this live are in your Orders tab, like any other order. Live prices stay on for 30 minutes after a live ends.</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/settings/marketplace?tab=lives" className="flex h-11 items-center rounded-xl bg-violet-600 px-5 text-[13.5px] font-semibold text-white">
          Schedule another live
        </Link>
        <Link href="/settings/marketplace?tab=orders" className="flex h-11 items-center rounded-xl border border-line px-5 text-[13.5px] font-semibold text-ink-2">
          See orders
        </Link>
      </div>
    </div>
  );
}

