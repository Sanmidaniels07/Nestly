"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  RefreshCw,
  Search,
  Share2,
  ShoppingBag,
  Store,
  SwitchCamera,
  ZoomIn,
} from "lucide-react";

import { useEndLive, useLive, usePinLiveProduct, useBanLiveViewer, useRemoveLiveMessage } from "@/src/hooks/use-lives";
import { useLiveRoom } from "@/src/hooks/use-live-room";
import { useAuthStore } from "@/src/store/auth-store";
import { getHostToken, startLive } from "@/src/services/live.services";
import { naira } from "@/src/lib/payment-link";
import { HostVideo, HostVideoHandle, MAX_ZOOM } from "@/src/components/live/live-video";
import { useLiveDock } from "@/src/components/live/live-dock-context";
import { ChatPreview, ControlButton, DEFAULT_CARD, LiveFrame, MiniButton, MovableCard, ProductRows, SidePanel, ZoomControl, useIsDesktop, useUnread } from "@/src/components/live/live-shell";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { FloatingHearts, LiveBadge, LiveChatInput, LiveChatList, PinnedProduct, PurchaseTicker, liveShareUrl, liveWhen } from "@/src/components/live/live-ui";
import { LiveVideo, SellerLive } from "@/src/types/live";
import { ApiErrorResponse } from "@/src/types/api";
import { AxiosError } from "axios";

// The seller's live studio (Zoom-style): camera with zoom, go live, show
// products from the live or anywhere in the store, chat with moderation,
// end the live - then the summary.

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

export function Studio({ live }: { live: SellerLive }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const myUserId = useAuthStore((state) => state.user?.id ?? null);
  const isDesktop = useIsDesktop();
  const videoRef = useRef<HostVideoHandle>(null);
  const [session, setSession] = useState<LiveVideo | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(live.startedAt);
  const [endsAt, setEndsAt] = useState<string | null>(live.endsAt);
  const [connection, setConnection] = useState<"offline" | "connecting" | "live" | "reconnecting">("offline");
  const [starting, setStarting] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [panelOpen, setPanelOpen] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"chat" | "products" | "store">("products");
  const [showZoom, setShowZoom] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const { mutate: endLive, isPending: ending } = useEndLive();
  const { mutate: pin } = usePinLiveProduct();
  const { mutate: removeMessage } = useRemoveLiveMessage();
  const { mutate: ban } = useBanLiveViewer();
  // Chat history (public endpoint) so a refreshed studio still shows it.
  const { data: publicLive } = useLive(live.code);

  const isLive = !!session;
  const dock = useLiveDock();
  const minimized = dock.minimized;
  // While broadcasting, the dock mustn't swap this live for another one.
  const { setHosting } = dock;
  useEffect(() => {
    setHosting(isLive);
  }, [isLive, setHosting]);
  const open = panelOpen ?? isDesktop;
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
  const unread = useUnread(room.messages.length, open && tab === "chat");

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

  // Products added mid-live (from the Store tab) arrive over the socket.
  const products = useMemo(
    () => (room.products ?? live.products).map((product) => (room.stock[product.id] !== undefined ? { ...product, stock: room.stock[product.id] } : product)),
    [room.products, live.products, room.stock]
  );
  const pinned = products.find((product) => product.id === room.pinnedProductId) ?? null;

  const show = (productId: string) => {
    if (!isLive) return toast("Go live first, then show products to everyone.");
    const next = room.pinnedProductId === productId ? null : productId;
    room.setPinnedProductId(next);
    pin({ id: live.id, productId: next }, { onError: () => room.setPinnedProductId(room.pinnedProductId) });
  };

  const showPanel = (next: "chat" | "products" | "store") => {
    if (open && tab === next) setPanelOpen(false);
    else {
      setTab(next);
      setPanelOpen(true);
    }
  };

  const changeZoom = (level: number) => {
    setZoom(level);
    videoRef.current?.setZoom(level);
  };

  const early = new Date(live.scheduledAt).getTime() - now > 60 * 60 * 1000;

  // Keep broadcasting in the mini window while using the rest of the app
  // (the studio page closing is what minimizes it - see live-dock.tsx).
  const minimize = () => {
    setShowZoom(false);
    if (window.history.length > 1) router.back();
    else router.push("/dashboard");
  };
  const expand = () => router.push(`/marketplace/live/${live.id}`);

  const top = (
    <>
      <button
        type="button"
        onClick={() => (isLive ? minimize() : router.push("/settings/marketplace?tab=lives"))}
        aria-label={isLive ? "Minimize - keep your live going while you use the app" : "Back"}
        className={`flex h-9 shrink-0 items-center justify-center gap-1 rounded-full hover:bg-white/10 ${isLive ? "bg-white/10 pl-1.5 pr-3 text-[12px] font-semibold" : "w-9"}`}
      >
        {isLive ? <ChevronDown size={20} /> : <ArrowLeft size={19} />}
        {isLive && "Minimize"}
      </button>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-semibold">{live.title}</span>
        <span className="block truncate text-[11.5px] text-white/60">{isLive ? "You're live" : "Preview - only you can see this"}</span>
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-2">
        {connection === "reconnecting" && (
          <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[11.5px] font-semibold text-black">
            <RefreshCw size={12} className="animate-spin" /> Reconnecting
          </span>
        )}
        {isLive && secondsLeft !== null && secondsLeft <= 5 * 60 ? (
          <span className="rounded-md bg-amber-500 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[12px] font-semibold text-black">Ends {clock(secondsLeft)}</span>
        ) : (
          elapsed !== null && <span className="rounded-md bg-white/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[12px]">{clock(elapsed)}</span>
        )}
        {isLive && <LiveBadge viewers={room.viewers} />}
      </span>
    </>
  );

  const stage = (
    <>
      <HostVideo ref={videoRef} session={session} onConnection={setConnection} onError={(message) => toast.error(message)} />
      {!minimized && <FloatingHearts hearts={room.hearts} />}

      {!minimized && zoom > 1 && !showZoom && (
        <button type="button" onClick={() => changeZoom(1)} className="absolute right-3 top-3 z-20 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold backdrop-blur">
          {zoom.toFixed(1)}x · Reset
        </button>
      )}

      {!isLive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-sm space-y-3 rounded-3xl bg-black/70 p-5 backdrop-blur">
            <div>
              <p className="text-[16px] font-semibold">{live.title}</p>
              <p className="text-[12.5px] text-white/70">
                Scheduled for {liveWhen(live.scheduledAt)} · {live.interestedCount} waiting
              </p>
            </div>
            <ul className="space-y-1 text-[12.5px] text-white/80">
              <li>• Good light on your face and products, phone steady.</li>
              <li>• Keep this screen open - the live stops if your phone locks.</li>
              <li>• Use Zoom to show details up close, and Products or Store to put an item on everyone&apos;s screen with a Buy button. Drag it anywhere, pinch to resize.</li>
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
        </div>
      )}

      {isLive && !minimized && (
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 ${pinned ? "pb-28" : ""}`}>
          <div className="pointer-events-auto space-y-2">
            <PurchaseTicker purchase={room.purchase} />
            {!open && <ChatPreview messages={room.messages} onOpen={() => showPanel("chat")} />}
          </div>
        </div>
      )}

      {isLive && !minimized && pinned && (
        <MovableCard
          layout={room.card ?? DEFAULT_CARD}
          onChange={room.sendCard}
          onReset={room.card ? () => room.sendCard(DEFAULT_CARD) : undefined}
          resetLabel="Back to corner"
        >
          <PinnedProduct product={pinned} stock={room.stock[pinned.id]} onBuy={() => show(pinned.id)} actionLabel="Hide" />
        </MovableCard>
      )}

      {!minimized && showZoom && (
        <ZoomControl zoom={zoom} max={MAX_ZOOM} onChange={changeZoom} onClose={() => setShowZoom(false)} note="Viewers see this zoom too" />
      )}
    </>
  );

  const showButton = (productId: string) => {
    const showing = room.pinnedProductId === productId;
    return (
      <button
        type="button"
        onClick={() => show(productId)}
        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-semibold ${showing ? "bg-violet-600 text-white" : "border border-line text-ink-2"}`}
      >
        {showing ? <EyeOff size={14} /> : <Eye size={14} />}
        {showing ? "Hide" : "Show"}
      </button>
    );
  };

  const panel = (
    <SidePanel
      open={open}
      tabs={[
        { id: "chat", label: "Chat", icon: MessageCircle, count: room.messages.length },
        { id: "products", label: "Products", icon: ShoppingBag, count: products.length },
        { id: "store", label: "Store", icon: Store },
      ]}
      active={tab}
      onTab={(id) => setTab(id as "chat" | "products" | "store")}
      onClose={() => setPanelOpen(false)}
    >
      {tab === "chat" && (
        <>
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
            <LiveChatInput variant="panel" placeholder="Message everyone…" onSend={room.sendChat} blocked={isLive ? null : { label: "Chat opens when you go live" }} />
          </div>
        </>
      )}
      {tab === "products" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <p className="mb-2 text-[12px] text-muted">Tap Show to put a product on everyone&apos;s screen with a Buy button.</p>
          <ProductRows products={products} highlightId={room.pinnedProductId} action={(product) => showButton(product.id)} empty="No products in this live yet - add some from the Store tab." />
        </div>
      )}
      {tab === "store" && <StoreTab liveProductIds={products.map((product) => product.id)} pinnedId={room.pinnedProductId} onShow={show} />}
    </SidePanel>
  );

  const controls = (
    <>
      <ControlButton
        icon={micOn ? Mic : MicOff}
        label={micOn ? "Mute" : "Unmute"}
        off={!micOn}
        onClick={() => {
          videoRef.current?.setMicOn(!micOn);
          setMicOn(!micOn);
        }}
      />
      <ControlButton
        icon={SwitchCamera}
        label="Flip"
        onClick={() => {
          videoRef.current?.flipCamera();
          setZoom(1);
        }}
      />
      <ControlButton icon={ZoomIn} label="Zoom" active={showZoom || zoom > 1} onClick={() => setShowZoom((value) => !value)} />
      <ControlButton icon={MessageCircle} label="Chat" active={open && tab === "chat"} badge={unread} onClick={() => showPanel("chat")} />
      <ControlButton icon={ShoppingBag} label="Products" active={open && (tab === "products" || tab === "store")} onClick={() => showPanel("products")} />
      <ControlButton icon={Share2} label="Share" onClick={share} />
      {isLive ? (
        <ControlButton icon={PhoneOff} label="End" danger onClick={() => setConfirmEnd(true)} />
      ) : (
        <ControlButton icon={Radio} label={starting ? "Starting" : "Go live"} danger onClick={goLive} disabled={starting || early} />
      )}
    </>
  );

  return (
    <>
      <LiveFrame
        top={top}
        stage={stage}
        panel={panel}
        controls={controls}
        minimized={minimized}
        onExpand={expand}
        mini={
          <MiniButton
            icon={micOn ? Mic : MicOff}
            label={micOn ? "Mute microphone" : "Unmute microphone"}
            danger={!micOn}
            onClick={() => {
              videoRef.current?.setMicOn(!micOn);
              setMicOn(!micOn);
            }}
          />
        }
      />

      {confirmEnd && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-6" onClick={() => setConfirmEnd(false)}>
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
    </>
  );
}

/** Everything published in the store - show any of it during the live (it joins the live at its normal price). */
function StoreTab({ liveProductIds, pinnedId, onShow }: { liveProductIds: string[]; pinnedId: string | null; onShow: (productId: string) => void }) {
  const { data, isLoading } = useMyProducts({ status: "PUBLISHED", limit: 100 });
  const [query, setQuery] = useState("");
  const all = data?.products ?? [];
  const shown = all.filter((product) => product.title.toLowerCase().includes(query.trim().toLowerCase()));
  const inLive = new Set(liveProductIds);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line p-3">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
          <Search size={15} className="text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your store"
            className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-subtle sm:text-[13.5px]"
          />
        </div>
        <p className="mt-2 text-[11.5px] text-muted">Showing something new adds it to this live at its normal price.</p>
      </div>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {isLoading && <li className="py-8 text-center"><Loader2 size={20} className="mx-auto animate-spin text-muted" /></li>}
        {!isLoading && shown.length === 0 && <li className="py-8 text-center text-[13px] text-muted">No published products found.</li>}
        {shown.map((product) => {
          const showing = pinnedId === product.id;
          return (
            <li key={product.id} className={`flex items-center gap-3 rounded-2xl border p-2.5 ${showing ? "border-violet-400 bg-violet-50/60 dark:bg-violet-500/10" : "border-line bg-surface"}`}>
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                {product.images[0] && <Image src={product.images[0].url} alt="" fill sizes="48px" className="object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-ink">{product.title}</span>
                <span className="text-[12px] text-muted">
                  {naira(product.price)}
                  {inLive.has(product.id) && <span className="ml-1.5 text-violet-600 dark:text-violet-300">· in this live</span>}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onShow(product.id)}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-semibold ${showing ? "bg-violet-600 text-white" : "border border-line text-ink-2"}`}
              >
                {showing ? <EyeOff size={14} /> : <Eye size={14} />}
                {showing ? "Hide" : "Show"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

