"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getLiveSocket } from "../lib/live-socket";
import { LiveChatMessage, LiveProduct, LiveStatus } from "../types/live";

// Everything that happens in a live room over the /live socket: chat,
// hearts, the pinned product, "X just bought", stock and the viewer count.
// Used by both the viewer page and the seller's studio.

const MAX_MESSAGES = 150;

/** Where the seller put the product card: x/y 0-1 across the free space, scale = size. */
export interface CardLayout {
  x: number;
  y: number;
  scale: number;
}

export interface LivePurchase {
  key: number;
  name: string;
  productTitle: string | null;
}

interface Options {
  liveId: string;
  initialMessages: LiveChatMessage[];
  initialPinned: string | null;
  initialViewers: number;
  myUserId?: string | null;
  // Called when the live starts / ends / is cancelled, so the page can refetch.
  onStatus?: (status: LiveStatus) => void;
  onTimeWarning?: (minutesLeft: number) => void;
}

export function useLiveRoom({ liveId, initialMessages, initialPinned, initialViewers, myUserId, onStatus, onTimeWarning }: Options) {
  const [messages, setMessages] = useState<LiveChatMessage[]>(initialMessages);
  const [pinnedProductId, setPinnedProductId] = useState<string | null>(initialPinned);
  const [viewers, setViewers] = useState(initialViewers);
  const [hearts, setHearts] = useState<number[]>([]);
  const [purchase, setPurchase] = useState<LivePurchase | null>(null);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [banned, setBanned] = useState(false);
  // Set when the seller adds a product mid-live (the full new list).
  const [products, setProducts] = useState<LiveProduct[] | null>(null);
  const [card, setCard] = useState<CardLayout | null>(null);
  const [connected, setConnected] = useState(false);

  // Latest callbacks without re-subscribing.
  const handlers = useRef({ onStatus, onTimeWarning });
  useEffect(() => {
    handlers.current = { onStatus, onTimeWarning };
  });

  const heartKey = useRef(0);
  const addHeart = useCallback(() => {
    const key = ++heartKey.current;
    setHearts((current) => [...current.slice(-24), key]);
    setTimeout(() => setHearts((current) => current.filter((item) => item !== key)), 2600);
  }, []);

  useEffect(() => {
    const socket = getLiveSocket();
    const join = () => {
      socket.emit("live:join", { liveId }, (reply: { ok: boolean; viewers?: number; card?: CardLayout | null }) => {
        setConnected(reply.ok);
        if (reply.ok && typeof reply.viewers === "number") setViewers(reply.viewers);
        if (reply.ok && reply.card) setCard(reply.card);
      });
    };

    const onChat = (message: LiveChatMessage) =>
      setMessages((current) => (current.some((m) => m.id === message.id) ? current : [...current, message].slice(-MAX_MESSAGES)));
    const onRemoved = ({ id }: { id: string }) => setMessages((current) => current.filter((m) => m.id !== id));
    const onViewers = ({ viewers: count }: { viewers: number }) => setViewers(count);
    const onPinned = ({ productId }: { productId: string | null }) => setPinnedProductId(productId);
    const onStatusEvent = ({ status }: { status: LiveStatus }) => {
      if (status !== "LIVE") setPinnedProductId(null);
      handlers.current.onStatus?.(status);
    };
    const onPurchase = ({ name, productTitle }: { name: string; productTitle: string | null }) => {
      const key = Date.now();
      setPurchase({ key, name, productTitle });
      setTimeout(() => setPurchase((current) => (current?.key === key ? null : current)), 5000);
    };
    const onStock = ({ productId, stock: left }: { productId: string; stock: number }) =>
      setStock((current) => ({ ...current, [productId]: left }));
    const onBanned = ({ userId }: { userId: string }) => {
      if (myUserId && userId === myUserId) setBanned(true);
    };
    const onWarning = ({ minutesLeft }: { minutesLeft: number }) => handlers.current.onTimeWarning?.(minutesLeft);
    const onDisconnect = () => setConnected(false);
    const onProducts = ({ products: list }: { products: LiveProduct[] }) => setProducts(list);
    const onCard = (layout: CardLayout) => setCard(layout);

    socket.on("connect", join);
    socket.on("disconnect", onDisconnect);
    socket.on("live:chat", onChat);
    socket.on("live:message-removed", onRemoved);
    socket.on("live:viewers", onViewers);
    socket.on("live:pinned", onPinned);
    socket.on("live:status", onStatusEvent);
    socket.on("live:purchase", onPurchase);
    socket.on("live:stock", onStock);
    socket.on("live:banned", onBanned);
    socket.on("live:heart", addHeart);
    socket.on("live:time-warning", onWarning);
    socket.on("live:products", onProducts);
    socket.on("live:card", onCard);

    if (socket.connected) join();
    else socket.connect();

    return () => {
      socket.emit("live:leave", { liveId });
      socket.off("connect", join);
      socket.off("disconnect", onDisconnect);
      socket.off("live:chat", onChat);
      socket.off("live:message-removed", onRemoved);
      socket.off("live:viewers", onViewers);
      socket.off("live:pinned", onPinned);
      socket.off("live:status", onStatusEvent);
      socket.off("live:purchase", onPurchase);
      socket.off("live:stock", onStock);
      socket.off("live:banned", onBanned);
      socket.off("live:heart", addHeart);
      socket.off("live:time-warning", onWarning);
      socket.off("live:products", onProducts);
      socket.off("live:card", onCard);
    };
  }, [liveId, myUserId, addHeart]);

  const sendChat = useCallback(
    (text: string) =>
      new Promise<{ ok: boolean; error?: string }>((resolve) => {
        getLiveSocket()
          .timeout(8000)
          .emit("live:chat", { liveId, text }, (error: Error | null, reply: { ok: boolean; error?: string; message?: LiveChatMessage }) => {
            if (error) return resolve({ ok: false, error: "Couldn't send - check your connection." });
            if (reply.ok && reply.message) {
              const message = reply.message;
              setMessages((current) => (current.some((m) => m.id === message.id) ? current : [...current, message].slice(-MAX_MESSAGES)));
            }
            resolve(reply);
          });
      }),
    [liveId]
  );

  // Seller only: move / resize the product card for everyone. Sent at most
  // every 50ms, and the final spot is always sent.
  const cardTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCardSent = useRef(0);
  const sendCard = useCallback(
    (layout: CardLayout) => {
      setCard(layout);
      const emit = () => {
        lastCardSent.current = Date.now();
        getLiveSocket().emit("live:card", { liveId, ...layout });
      };
      if (cardTimer.current) clearTimeout(cardTimer.current);
      const wait = 50 - (Date.now() - lastCardSent.current);
      if (wait <= 0) emit();
      else cardTimer.current = setTimeout(emit, wait);
    },
    [liveId]
  );

  const sendHeart = useCallback(() => {
    getLiveSocket().emit("live:heart", { liveId });
    addHeart();
  }, [liveId, addHeart]);

  return {
    messages,
    setMessages,
    pinnedProductId,
    setPinnedProductId,
    viewers,
    hearts,
    purchase,
    stock,
    banned,
    connected,
    products,
    card,
    sendCard,
    sendChat,
    sendHeart,
  };
}
