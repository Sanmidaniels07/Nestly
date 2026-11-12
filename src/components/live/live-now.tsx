"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Room } from "livekit-client";
import {
  ChevronDown,
  Heart,
  Mic,
  MicOff,
  Users,
  VideoOff,
  Loader2,
  LogOut,
  MessageCircle,
  Share2,
  ShoppingBag,
  Store,
  Video,
  ZoomIn,
  X,
} from "lucide-react";

import { CardLayout, useLiveRoom } from "@/src/hooks/use-live-room";
import { useLivePeople } from "@/src/hooks/use-live-people";
import { PeopleList, PeopleStrip } from "@/src/components/live/live-people";
import { useRequireLogin, useSession } from "@/src/hooks/use-session";
import { useAuthStore } from "@/src/store/auth-store";
import { getWatchToken } from "@/src/services/live.services";
import { reconnectLiveSocket } from "@/src/lib/live-socket";
import { rememberReturnTo } from "@/src/lib/return-to";
import { ViewerVideo } from "@/src/components/live/live-video";
import LiveBuySheet from "@/src/components/live/live-buy-sheet";
import { useLiveDock } from "@/src/components/live/live-dock-context";
import { ChatPreview, ControlButton, DEFAULT_CARD, LiveFrame, MiniButton, MovableCard, ProductRows, SidePanel, ZoomControl, useIsDesktop, useUnread, useViewerZoom } from "@/src/components/live/live-shell";
import {
  FloatingHearts,
  LiveBadge,
  LiveChatInput,
  LiveChatList,
  PinnedProduct,
  PurchaseTicker,
  liveShareUrl,
} from "@/src/components/live/live-ui";
import { PublicLive, WatchToken } from "@/src/types/live";

// Guests watch this long before being asked to sign up.
const PREVIEW_SECONDS = 60;

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

export function LiveNow({ live }: { live: PublicLive }) {
  const queryClient = useQueryClient();
  const { isLoggedIn, isHydrated } = useSession();
  const myUserId = useAuthStore((state) => state.user?.id ?? null);
  const requireLogin = useRequireLogin();
  const isDesktop = useIsDesktop();
  const [video, setVideo] = useState<WatchToken | null>(null);
  const [videoError, setVideoError] = useState("");
  const [buying, setBuying] = useState<string | null>(null);
  // null = the default: open beside the video on wide screens, closed on phones.
  const [panelOpen, setPanelOpen] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"chat" | "products" | "people">("chat");
  // The video room once connected: who's here, and this buyer's own mic / camera.
  const [mediaRoom, setMediaRoom] = useState<Room | null>(null);
  const { people, me, setMic, setCamera } = useLivePeople(mediaRoom);
  const [showZoom, setShowZoom] = useState(false);
  // Where this viewer moved the product card to (only on their screen); null = follow the seller.
  const [myCard, setMyCard] = useState<CardLayout | null>(null);
  const zoom = useViewerZoom();
  const router = useRouter();
  const dock = useLiveDock();
  const minimized = dock.minimized;

  const guest = isHydrated && !isLoggedIn;
  const previewLeft = useGuestPreview(live.code, guest);
  const gated = guest && previewLeft <= 0;
  const open = panelOpen ?? isDesktop;

  const refetch = useCallback(() => queryClient.invalidateQueries({ queryKey: ["lives", "public", live.code] }), [queryClient, live.code]);

  const room = useLiveRoom({
    liveId: live.id,
    initialMessages: live.messages,
    initialPinned: live.pinnedProductId,
    initialViewers: live.viewers,
    myUserId,
    onStatus: () => refetch(),
  });
  const unread = useUnread(room.messages.length, open && tab === "chat");

  // Chat history can arrive after the room opened (a fresh fetch of the
  // live) - add anything we don't have yet, in order.
  const { setMessages } = room;
  useEffect(() => {
    setMessages((current) => {
      const ids = new Set(current.map((message) => message.id));
      const missing = live.messages.filter((message) => !ids.has(message.id));
      if (missing.length === 0) return current;
      return [...missing, ...current].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });
  }, [live.messages, setMessages]);

  // Same for the product being shown: the page can open with an older copy
  // of the live, so follow each fresh fetch.
  const { setPinnedProductId } = room;
  useEffect(() => {
    setPinnedProductId(live.pinnedProductId);
  }, [live.pinnedProductId, setPinnedProductId]);

  // A guest who logs in mid-live: reconnect so chat knows who they are.
  useEffect(() => {
    if (isLoggedIn) reconnectLiveSocket();
  }, [isLoggedIn]);

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

  // Products the seller adds mid-live arrive over the socket.
  const products = useMemo(
    () => (room.products ?? live.products).map((product) => (room.stock[product.id] !== undefined ? { ...product, stock: room.stock[product.id] } : product)),
    [room.products, live.products, room.stock]
  );
  const pinned = products.find((product) => product.id === room.pinnedProductId) ?? null;
  const liveWithProducts = useMemo(() => ({ ...live, products }), [live, products]);

  const buy = (productId: string) => {
    if (live.isOwner) return;
    if (!requireLogin("Log in or create a free account to buy at the live price.")) return;
    setBuying(productId);
  };

  const showPanel = (next: "chat" | "products" | "people") => {
    if (open && tab === next) setPanelOpen(false);
    else {
      setTab(next);
      setPanelOpen(true);
    }
  };

  const share = async () => {
    const url = liveShareUrl(live.code, live.referralCode);
    try {
      if (navigator.share) return await navigator.share({ title: live.title, text: `${live.store.name} is live on Nestly: ${live.title}`, url });
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      // closed
    }
  };

  // Shrink to the mini window and go back to where they were (the page
  // closing is what minimizes it - see live-dock.tsx).
  const minimize = () => {
    setBuying(null);
    setShowZoom(false);
    if (window.history.length > 1) router.back();
    else router.push("/marketplace");
  };
  const expand = () => router.push(`/live/${live.code}`);
  const leave = () => {
    dock.close({ kind: "viewer", code: live.code });
    router.push("/marketplace");
  };

  const chatBlocked = live.isOwner
    ? { label: "Chat from your studio" }
    : !isLoggedIn
      ? { label: "Log in to chat with the seller", action: () => requireLogin("Log in or create a free account to chat.") }
      : room.banned || live.isBanned
        ? { label: "The seller turned off chat for you" }
        : null;

  const top = (
    <>
      <button type="button" onClick={minimize} aria-label="Minimize the live" title="Minimize - keep watching while you browse" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
        <ChevronDown size={22} />
      </button>
      <Link href={`/marketplace/seller/${live.store.slug}`} className="flex min-w-0 items-center gap-2 rounded-full py-1 pr-2">
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-500">
          {live.store.logo ? <Image src={live.store.logo} alt="" fill sizes="32px" className="object-cover" /> : <Store size={15} />}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13.5px] font-semibold">{live.store.name}</span>
          <span className="block truncate text-[11.5px] text-white/60">{live.title}</span>
        </span>
      </Link>
      <span className="ml-auto flex shrink-0 items-center gap-1.5">
        <LiveBadge viewers={room.viewers} />
        <button type="button" onClick={share} aria-label="Share this live" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
          <Share2 size={18} />
        </button>
      </span>
    </>
  );

  const stage = live.isOwner ? (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-violet-900 to-black px-8 text-center">
      <Video size={32} />
      <p className="text-[15px] font-semibold">You&apos;re live</p>
      <p className="text-[13px] text-white/70">Your camera and controls are in your studio.</p>
      <Link href={`/marketplace/live/${live.id}`} className="mt-2 rounded-xl bg-white px-5 py-2.5 text-[13.5px] font-semibold text-violet-700">
        Open studio
      </Link>
    </div>
  ) : gated ? (
    minimized ? <div className="absolute inset-0 bg-gradient-to-b from-violet-800 to-black" /> : <GuestGate live={live} />
  ) : (
    <>
      <div {...zoom.bind} className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={zoom.transform}>
          {video ? (
            <ViewerVideo url={video.url} token={video.token} onRoom={setMediaRoom} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
              {videoError ? <p className="px-8 text-center text-[13.5px]">{videoError}</p> : <Loader2 size={26} className="animate-spin" />}
            </div>
          )}
        </div>
      </div>

      {!minimized && guest && (
        <p className="absolute left-3 top-3 z-20 rounded-full bg-black/60 px-3 py-1 text-[11.5px] backdrop-blur">
          Free preview: {previewLeft}s left ·{" "}
          <button type="button" onClick={() => requireLogin("Create a free account to keep watching.")} className="font-semibold underline">
            Sign up to keep watching
          </button>
        </p>
      )}
      {!minimized && (
        <div className={`pointer-events-none absolute left-3 right-16 z-20 ${guest ? "top-12" : "top-3"}`}>
          <PeopleStrip people={people} onOpen={() => showPanel("people")} />
        </div>
      )}
      {!minimized && zoom.zoom > 1 && !showZoom && (
        <button type="button" onClick={() => zoom.setZoom(1)} className="absolute right-3 top-3 z-20 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold backdrop-blur">
          {zoom.zoom.toFixed(1)}x · Reset
        </button>
      )}

      {!minimized && <FloatingHearts hearts={room.hearts} />}
      {!minimized && (
        <button
          type="button"
          onClick={room.sendHeart}
          aria-label="Send a heart"
          className={`absolute right-3 z-20 flex h-12 w-12 ${pinned ? "bottom-32" : "bottom-4"} items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-900/30 active:scale-90`}
        >
          <Heart size={22} className="fill-white" />
        </button>
      )}

      <div className={`pointer-events-none ${minimized ? "hidden" : ""} absolute inset-x-0 bottom-0 z-10 p-3 ${pinned ? "pb-28" : ""}`}>
        <div className="pointer-events-auto space-y-2">
          <PurchaseTicker purchase={room.purchase} />
          {!open && <ChatPreview messages={room.messages} onOpen={() => showPanel("chat")} />}
        </div>
      </div>

      {!minimized && pinned && (
        <MovableCard
          layout={myCard ?? room.card ?? DEFAULT_CARD}
          onChange={setMyCard}
          onReset={myCard ? () => setMyCard(null) : undefined}
          resetLabel="Follow seller"
        >
          <PinnedProduct product={pinned} stock={room.stock[pinned.id]} onBuy={() => buy(pinned.id)} />
        </MovableCard>
      )}

      {!minimized && showZoom && (
        <ZoomControl zoom={zoom.zoom} max={zoom.max} onChange={zoom.setZoom} onClose={() => setShowZoom(false)} note="Pinch or double-tap the video too" />
      )}
    </>
  );

  const panel = !gated && !live.isOwner && (
    <SidePanel
      open={open}
      tabs={[
        { id: "chat", label: "Chat", icon: MessageCircle, count: room.messages.length },
        { id: "products", label: "Products", icon: ShoppingBag, count: products.length },
        { id: "people", label: "People", icon: Users, count: people.length },
      ]}
      active={tab}
      onTab={(id) => setTab(id as "chat" | "products" | "people")}
      onClose={() => setPanelOpen(false)}
    >
      {tab === "people" ? (
        <PeopleList people={people} guests={Math.max(0, room.viewers - people.filter((person) => !person.isHost).length)} />
      ) : tab === "chat" ? (
        <>
          <div className="min-h-0 flex-1">
            <LiveChatList variant="panel" messages={room.messages} />
          </div>
          <div className="border-t border-line p-3">
            <LiveChatInput variant="panel" onSend={room.sendChat} blocked={chatBlocked} placeholder="Message everyone…" />
          </div>
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {live.discountActive && products.some((p) => p.discountPercent) && (
            <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Live prices are on now</p>
          )}
          <ProductRows
            products={products}
            highlightId={room.pinnedProductId}
            empty="The seller hasn't added products yet."
            action={(product) => (
              <button
                type="button"
                onClick={() => buy(product.id)}
                disabled={!product.available || product.stock <= 0}
                className="h-9 shrink-0 rounded-xl bg-violet-600 px-3.5 text-[12.5px] font-semibold text-white disabled:bg-zinc-400"
              >
                {product.available && product.stock > 0 ? "Buy" : "Sold out"}
              </button>
            )}
          />
          <Link
            href={`/marketplace/seller/${live.store.slug}`}
            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-[13px] font-semibold text-ink-2 hover:bg-surface-2"
          >
            <Store size={15} /> See everything in {live.store.name}
          </Link>
        </div>
      )}
    </SidePanel>
  );

  // Mic / camera: signed-in buyers only, and only what the seller allows.
  const media = (source: "microphone" | "camera") => {
    const isMic = source === "microphone";
    const on = isMic ? !!me?.micOn : !!me?.camOn;
    const allowed = isMic ? !!me?.canMic : !!me?.canCam;
    if (guest) {
      return { on: false, label: isMic ? "Unmute" : "Start video", disabled: gated, onClick: () => requireLogin(`Log in or create a free account to ${isMic ? "speak" : "show your camera"} on the live.`) };
    }
    if (live.isOwner || !me) return { on: false, label: isMic ? "Unmute" : "Start video", disabled: true, onClick: () => {} };
    if (!allowed) return { on: false, label: isMic ? "Mic off" : "Video off", disabled: true, onClick: () => {} };
    return {
      on,
      label: isMic ? (on ? "Mute" : "Unmute") : on ? "Stop video" : "Start video",
      disabled: false,
      onClick: () => (isMic ? setMic(!on) : setCamera(!on)),
    };
  };
  const mic = media("microphone");
  const cam = media("camera");

  const controls = (
    <>
      <ControlButton icon={mic.on ? Mic : MicOff} label={mic.label} off={!mic.on} onClick={mic.onClick} disabled={mic.disabled} />
      <ControlButton icon={cam.on ? Video : VideoOff} label={cam.label} shortLabel="Video" off={!cam.on} onClick={cam.onClick} disabled={cam.disabled} />
      <ControlButton icon={MessageCircle} label="Chat" active={open && tab === "chat"} badge={unread} onClick={() => showPanel("chat")} disabled={gated || live.isOwner} />
      <ControlButton icon={ShoppingBag} label="Products" shortLabel="Items" badge={0} active={open && tab === "products"} onClick={() => showPanel("products")} disabled={gated || live.isOwner} />
      <ControlButton icon={ZoomIn} label="Zoom" active={showZoom || zoom.zoom > 1} onClick={() => setShowZoom((value) => !value)} disabled={gated || !video} />
      <ControlButton icon={LogOut} label="Leave" danger onClick={leave} />
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
          <>
            {me?.micOn && <MiniButton icon={Mic} label="Mute your mic" onClick={() => setMic(false)} />}
            <MiniButton icon={X} label="Leave the live" onClick={leave} />
          </>
        }
      />
      {buying && <LiveBuySheet live={liveWithProducts} productId={buying} onClose={() => setBuying(null)} />}
    </>
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
