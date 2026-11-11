"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Ban, Eye, Heart, Loader2, Send, ShoppingBag, Trash2 } from "lucide-react";

import { naira } from "@/src/lib/payment-link";
import { SITE_URL } from "@/src/lib/site";
import { LiveChatMessage, LiveProduct } from "@/src/types/live";
import { LivePurchase } from "@/src/hooks/use-live-room";

// Building blocks shared by the live page (viewers) and the studio (seller).

/** nestlyapp.site/live/{code}, tagged with the store's referral code. */
export const liveShareUrl = (code: string, referralCode?: string | null) =>
  `${SITE_URL}/live/${code}${referralCode ? `?ref=${referralCode}` : ""}`;

const LAGOS = new Intl.DateTimeFormat("en-NG", {
  timeZone: "Africa/Lagos",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});
export const liveWhen = (iso: string) => LAGOS.format(new Date(iso));

/** "₦5,200 (was ₦6,500)" style price, or the normal price / range. */
export function LivePrice({ product, size = "md" }: { product: LiveProduct; size?: "sm" | "md" }) {
  const big = size === "md" ? "text-[15px]" : "text-[13px]";
  const range = product.maxPrice > product.price;
  if (product.livePrice !== null) {
    return (
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        <span className={`font-[family-name:var(--font-mono)] font-semibold text-rose-600 dark:text-rose-400 ${big}`}>
          {range ? "from " : ""}
          {naira(product.livePrice)}
        </span>
        <span className="text-[11.5px] text-muted line-through">{naira(product.price)}</span>
        <span className="rounded bg-rose-100 px-1 text-[10.5px] font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
          -{product.discountPercent}%
        </span>
      </span>
    );
  }
  return (
    <span className={`font-[family-name:var(--font-mono)] font-semibold text-violet-700 dark:text-violet-300 ${big}`}>
      {range ? "from " : ""}
      {naira(product.price)}
    </span>
  );
}

export function LiveBadge({ viewers }: { viewers?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
      </span>
      {typeof viewers === "number" && (
        <span className="inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur">
          <Eye size={12} /> {viewers.toLocaleString()}
        </span>
      )}
    </span>
  );
}

/** Hearts floating up the right edge. */
export function FloatingHearts({ hearts }: { hearts: number[] }) {
  return (
    <div className="pointer-events-none absolute bottom-24 right-3 z-10 h-64 w-12">
      {hearts.map((key) => (
        <Heart
          key={key}
          size={26}
          className="live-heart absolute bottom-0 fill-rose-500 text-rose-500 drop-shadow"
          style={{ left: `${(key * 37) % 20}px`, animationDelay: `${(key % 3) * 60}ms` }}
        />
      ))}
    </div>
  );
}

export function PurchaseTicker({ purchase }: { purchase: LivePurchase | null }) {
  if (!purchase) return null;
  return (
    <div key={purchase.key} className="live-pop inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-600/90 px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg backdrop-blur">
      <ShoppingBag size={13} className="shrink-0" />
      <span className="truncate">
        {purchase.name} just bought {purchase.productTitle ? `"${purchase.productTitle}"` : "something"}
      </span>
    </div>
  );
}

/** The product the seller is showing right now. */
export function PinnedProduct({ product, stock, onBuy, actionLabel = "Buy now" }: { product: LiveProduct; stock?: number; onBuy?: () => void; actionLabel?: string }) {
  const left = stock ?? product.stock;
  const soldOut = left <= 0 || !product.available;
  return (
    <div className="live-pop flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-3 text-ink shadow-xl backdrop-blur dark:bg-zinc-900/95">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
        {product.image && <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold">{product.title}</span>
        <LivePrice product={product} size="sm" />
        {!soldOut && left <= 5 && <span className="block text-[11px] font-semibold text-amber-600">Only {left} left</span>}
      </span>
      {onBuy && (
        <button
          type="button"
          onClick={onBuy}
          disabled={soldOut}
          className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-[13px] font-semibold text-white disabled:from-zinc-400 disabled:to-zinc-400"
        >
          {soldOut ? "Sold out" : actionLabel}
        </button>
      )}
    </div>
  );
}

interface ChatProps {
  messages: LiveChatMessage[];
  // Seller tools (studio only).
  onRemove?: (message: LiveChatMessage) => void;
  onBan?: (message: LiveChatMessage) => void;
  variant?: "overlay" | "panel";
}

/** Chat messages, newest at the bottom. "overlay" sits on the video. */
export function LiveChatList({ messages, onRemove, onBan, variant = "overlay" }: ChatProps) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const overlay = variant === "overlay";
  return (
    <div className={`overflow-y-auto overscroll-contain ${overlay ? "live-chat-fade max-h-[34vh] space-y-1.5 pr-14" : "h-full space-y-2 p-3"}`}>
      {messages.length === 0 && !overlay && <p className="py-8 text-center text-[12.5px] text-muted">Chat messages will show here.</p>}
      {messages.map((message) => (
        <div key={message.id} className={`group flex items-start gap-2 ${overlay ? "text-white" : "text-ink"}`}>
          <span className={`relative mt-0.5 h-6 w-6 shrink-0 overflow-hidden rounded-full ${overlay ? "bg-white/20" : "bg-violet-100 dark:bg-violet-500/15"}`}>
            {message.user.avatar ? (
              <Image src={message.user.avatar} alt="" fill sizes="24px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10.5px] font-bold">{message.user.name.charAt(0).toUpperCase()}</span>
            )}
          </span>
          <p className={`min-w-0 flex-1 text-[13px] leading-snug ${overlay ? "[text-shadow:0_1px_2px_rgba(0,0,0,.6)]" : ""}`}>
            <span className={`mr-1.5 font-semibold ${message.isSeller ? "text-amber-300" : overlay ? "text-white/80" : "text-ink-2"} ${!overlay && message.isSeller ? "!text-amber-600" : ""}`}>
              {message.user.name}
              {message.isSeller && <span className="ml-1 rounded bg-amber-400 px-1 text-[9.5px] font-bold uppercase text-black">Seller</span>}
            </span>
            <span className="break-words">{message.text}</span>
          </p>
          {(onRemove || onBan) && !message.isSeller && (
            <span className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              {onRemove && (
                <button type="button" onClick={() => onRemove(message)} aria-label="Remove message" className="rounded-md p-1 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                  <Trash2 size={13} />
                </button>
              )}
              {onBan && (
                <button type="button" onClick={() => onBan(message)} aria-label={`Block ${message.user.name} from chat`} className="rounded-md p-1 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                  <Ban size={13} />
                </button>
              )}
            </span>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

interface ChatInputProps {
  onSend: (text: string) => Promise<{ ok: boolean; error?: string }>;
  // Shown instead of the box (e.g. "Log in to chat", "Chat is off for you").
  blocked?: { label: string; action?: () => void } | null;
  onHeart?: () => void;
  variant?: "overlay" | "panel";
}

export function LiveChatInput({ onSend, blocked, onHeart, variant = "overlay" }: ChatInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const overlay = variant === "overlay";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    setError("");
    const reply = await onSend(value);
    setSending(false);
    if (reply.ok) setText("");
    else setError(reply.error ?? "Couldn't send that.");
  };

  const heart = onHeart && (
    <button
      type="button"
      onClick={onHeart}
      aria-label="Send a heart"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg active:scale-90"
    >
      <Heart size={19} className="fill-white" />
    </button>
  );

  if (blocked) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={blocked.action}
          disabled={!blocked.action}
          className={`h-11 min-w-0 flex-1 truncate rounded-full px-4 text-left text-[13.5px] ${
            overlay ? "bg-black/40 text-white/85 backdrop-blur" : "border border-line bg-surface text-muted"
          }`}
        >
          {blocked.label}
        </button>
        {heart}
      </div>
    );
  }

  return (
    <div>
      {error && <p className={`mb-1.5 text-[12px] ${overlay ? "text-rose-200" : "text-red-600"}`}>{error}</p>}
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 200))}
          placeholder="Ask the seller something…"
          enterKeyHint="send"
          className={`h-11 min-w-0 flex-1 rounded-full px-4 text-[16px] outline-none sm:text-[14px] ${
            overlay
              ? "bg-black/40 text-white placeholder:text-white/60 backdrop-blur focus:ring-2 focus:ring-white/40"
              : "border border-line bg-surface text-ink placeholder:text-subtle focus:border-violet-400"
          }`}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white disabled:opacity-50"
        >
          {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        </button>
        {heart}
      </form>
    </div>
  );
}
