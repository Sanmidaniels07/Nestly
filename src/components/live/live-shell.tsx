"use client";

import { ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { LucideIcon, Minus, Move, Plus, X } from "lucide-react";

import type { CardLayout } from "@/src/hooks/use-live-room";
import { LiveChatMessage, LiveProduct } from "@/src/types/live";
import { LivePrice } from "./live-ui";

// The Zoom-style frame shared by the viewer's live page and the seller's
// studio: a top bar, the video as the main stage, a Chat / Products panel
// (beside the video on wide screens, sliding up over its lower half on
// phones) and a control bar along the bottom.

export function LiveFrame({ top, stage, panel, controls }: { top: ReactNode; stage: ReactNode; panel?: ReactNode; controls: ReactNode }) {
  // Full screen while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#0c0c10] text-white">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-2.5 pt-[env(safe-area-inset-top)] sm:px-4">{top}</header>
      <div className="relative flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1 overflow-hidden">{stage}</main>
        {panel}
      </div>
      <nav className="shrink-0 border-t border-white/10 bg-[#141419] pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-3xl items-stretch justify-around gap-0.5 px-1 py-1.5 sm:justify-center sm:gap-2">{controls}</div>
      </nav>
    </div>
  );
}

/** One button in the bottom control bar: icon over a short label. */
export function ControlButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  danger = false,
  off = false,
  badge,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  // e.g. a muted mic.
  off?: boolean;
  badge?: number;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`relative flex min-w-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-[10.5px] font-medium transition-colors disabled:opacity-40 sm:min-w-[68px] sm:flex-none sm:px-3 sm:text-[11.5px] ${
        danger ? "bg-rose-600 text-white hover:bg-rose-700" : active ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10"
      }`}
    >
      <Icon size={21} className={off ? "text-rose-400" : ""} />
      <span className="whitespace-nowrap">{label}</span>
      {!!badge && (
        <span className="absolute right-1.5 top-0.5 min-w-[18px] rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-white sm:right-3">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

export type PanelTab = { id: string; label: string; icon: LucideIcon; count?: number };

/** Chat / Products panel. Wide screens: a column beside the video. Phones: a sheet over the lower part of the video. */
export function SidePanel({
  open,
  tabs,
  active,
  onTab,
  onClose,
  children,
}: {
  open: boolean;
  tabs: PanelTab[];
  active: string;
  onTab: (id: string) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <aside className="absolute inset-x-0 bottom-0 z-30 flex h-[58%] flex-col rounded-t-3xl bg-canvas text-ink shadow-[0_-12px_40px_rgba(0,0,0,0.45)] lg:static lg:h-auto lg:w-[360px] lg:shrink-0 lg:rounded-none lg:border-l lg:border-white/10 lg:shadow-none xl:w-[400px]">
      <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line lg:hidden" />
      <div className="flex items-center border-b border-line px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[13px] font-semibold ${
              active === tab.id ? "border-violet-600 text-violet-700 dark:text-violet-300" : "border-transparent text-muted"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
            {typeof tab.count === "number" && <span className="text-[11.5px] font-medium opacity-70">({tab.count})</span>}
          </button>
        ))}
        <button type="button" onClick={onClose} aria-label="Close panel" className="ml-1 rounded-lg p-2 text-muted hover:bg-surface-2">
          <X size={18} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </aside>
  );
}

/** Phones with the panel closed: the latest few messages float over the video, like meeting chat pop-ups. */
export function ChatPreview({ messages, onOpen }: { messages: LiveChatMessage[]; onOpen: () => void }) {
  const latest = messages.slice(-3);
  if (latest.length === 0) return null;
  return (
    <button type="button" onClick={onOpen} className="live-chat-fade block w-full max-w-[80%] space-y-1.5 text-left lg:hidden">
      {latest.map((message) => (
        <p key={message.id} className="live-pop w-fit max-w-full rounded-2xl bg-black/55 px-3 py-1.5 text-[12.5px] leading-snug backdrop-blur">
          <span className={`mr-1.5 font-semibold ${message.isSeller ? "text-amber-300" : "text-white/75"}`}>{message.user.name}</span>
          <span className="break-words">{message.text}</span>
        </p>
      ))}
    </button>
  );
}

/** Products as rows, with an action button per row (Buy / Show). */
export function ProductRows({
  products,
  highlightId,
  action,
  empty,
}: {
  products: LiveProduct[];
  highlightId?: string | null;
  action: (product: LiveProduct) => ReactNode;
  empty?: ReactNode;
}) {
  if (products.length === 0) return <div className="px-4 py-10 text-center text-[13px] text-muted">{empty}</div>;
  return (
    <ul className="space-y-2">
      {products.map((product) => (
        <li
          key={product.id}
          className={`flex items-center gap-3 rounded-2xl border p-2.5 ${
            product.id === highlightId ? "border-violet-400 bg-violet-50/60 dark:bg-violet-500/10" : "border-line bg-surface"
          }`}
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
            {product.image && <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold">{product.title}</span>
            <LivePrice product={product} size="sm" />
            {product.id === highlightId && <span className="block text-[11px] font-semibold text-violet-600 dark:text-violet-300">Showing now</span>}
          </span>
          {action(product)}
        </li>
      ))}
    </ul>
  );
}

/** - [ 1.5x ] + control that floats over the stage. */
export function ZoomControl({ zoom, max, onChange, onClose, note }: { zoom: number; max: number; onChange: (zoom: number) => void; onClose: () => void; note?: string }) {
  const step = (delta: number) => onChange(Math.round(Math.min(max, Math.max(1, zoom + delta)) * 10) / 10);
  return (
    <div className="absolute bottom-3 left-1/2 z-20 w-[min(92%,340px)] -translate-x-1/2 rounded-2xl bg-black/70 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => step(-0.5)} disabled={zoom <= 1} aria-label="Zoom out" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 disabled:opacity-40">
          <Minus size={17} />
        </button>
        <input
          type="range"
          min={1}
          max={max}
          step={0.1}
          value={zoom}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Zoom"
          className="min-w-0 flex-1 accent-violet-500"
        />
        <button type="button" onClick={() => step(0.5)} disabled={zoom >= max} aria-label="Zoom in" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 disabled:opacity-40">
          <Plus size={17} />
        </button>
        <button type="button" onClick={onClose} aria-label="Close zoom" className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10">
          <X size={16} />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11.5px] text-white/70">
        <span>{note}</span>
        <span className="flex gap-1">
          {[1, 2, 3].filter((level) => level <= max).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`rounded-md px-2 py-0.5 font-semibold ${Math.abs(zoom - level) < 0.05 ? "bg-white text-black" : "bg-white/10 text-white"}`}
            >
              {level}x
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}

const VIEWER_MAX_ZOOM = 4;

/**
 * Lets a viewer zoom into the video on their own screen: pinch or the mouse
 * wheel to zoom, drag to look around, double-tap to zoom in / back out.
 */
export function useViewerZoom() {
  const [zoom, setZoomState] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const lastTap = useRef(0);
  const [gesturing, setGesturing] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const clampOffset = (next: { x: number; y: number }, level: number) => {
    const el = box.current;
    if (!el || level <= 1) return { x: 0, y: 0 };
    const maxX = (el.clientWidth * (level - 1)) / 2;
    const maxY = (el.clientHeight * (level - 1)) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, next.x)), y: Math.max(-maxY, Math.min(maxY, next.y)) };
  };

  const setZoom = (next: number) => {
    const level = Math.min(VIEWER_MAX_ZOOM, Math.max(1, next));
    setZoomState(level);
    setOffset((current) => clampOffset(current, level));
  };

  const bind = {
    ref: box,
    style: { touchAction: "none" as const },
    onPointerDown: (event: React.PointerEvent) => {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
        setGesturing(true);
        drag.current = null;
      } else if (pointers.current.size === 1) {
        drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
        setGesturing(true);
        const now = Date.now();
        if (now - lastTap.current < 300) setZoom(zoom > 1 ? 1 : 2);
        lastTap.current = now;
      }
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (!pointers.current.has(event.pointerId)) return;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pinch.current && pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        setZoom((pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.distance);
      } else if (drag.current && zoom > 1) {
        const start = drag.current;
        setOffset(clampOffset({ x: start.ox + event.clientX - start.x, y: start.oy + event.clientY - start.y }, zoom));
      }
    },
    onPointerUp: (event: React.PointerEvent) => {
      pointers.current.delete(event.pointerId);
      if (pointers.current.size < 2) pinch.current = null;
      if (pointers.current.size === 0) {
        drag.current = null;
        setGesturing(false);
      }
    },
    onPointerCancel: (event: React.PointerEvent) => {
      pointers.current.delete(event.pointerId);
      pinch.current = null;
      drag.current = null;
      setGesturing(false);
    },
    onWheel: (event: React.WheelEvent) => setZoom(zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12)),
  };

  const transform = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
    transition: gesturing ? "none" : "transform 0.15s ease-out",
  };

  return { zoom, setZoom, max: VIEWER_MAX_ZOOM, bind, transform };
}

const desktopQuery = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/** True on wide screens (the panel sits beside the video there). */
export function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => false);
}

/** Messages that arrived while the chat tab wasn't on screen. */
export function useUnread(count: number, watching: boolean) {
  const [seen, setSeen] = useState(count);
  if (watching && seen !== count) setSeen(count);
  return watching ? 0 : Math.max(0, count - seen);
}

export const DEFAULT_CARD: CardLayout = { x: 0, y: 1, scale: 1 };
const CARD_MIN = 0.6;
const CARD_MAX = 1.8;
const clampScale = (scale: number) => Math.round(Math.min(CARD_MAX, Math.max(CARD_MIN, scale)) * 100) / 100;

type CardGesture = { kind: "drag"; px: number; py: number; left: number; top: number } | { kind: "pinch"; distance: number; scale: number };

/**
 * The product card the seller is showing. It can be dragged anywhere on the
 * video and made bigger or smaller (pinch, mouse wheel, or tap it for - / +).
 * x/y are 0-1 across the free space, so the card sits in the same spot on any
 * screen size. The page decides who sees a change: the seller's goes to
 * everyone, a viewer's stays on their own screen.
 */
export function MovableCard({
  layout,
  onChange,
  onReset,
  resetLabel,
  children,
}: {
  layout: CardLayout;
  onChange: (layout: CardLayout) => void;
  // Shown as a button in the toolbar when set (e.g. "Follow seller").
  onReset?: () => void;
  resetLabel?: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tools, setTools] = useState(false);
  const [gesture, setGesture] = useState<CardGesture | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  // Track the stage and card sizes (the card's unscaled size).
  useEffect(() => {
    const frameEl = frameRef.current;
    const cardEl = cardRef.current;
    if (!frameEl || !cardEl) return;
    const observer = new ResizeObserver(() => {
      setFrame({ w: frameEl.clientWidth, h: frameEl.clientHeight });
      setSize({ w: cardEl.offsetWidth, h: cardEl.offsetHeight });
    });
    observer.observe(frameEl);
    observer.observe(cardEl);
    return () => observer.disconnect();
  }, []);

  const freeW = Math.max(0, frame.w - size.w * layout.scale);
  const freeH = Math.max(0, frame.h - size.h * layout.scale);
  const left = layout.x * freeW;
  const top = layout.y * freeH;

  const place = (nextLeft: number, nextTop: number, scale: number) => {
    const w = Math.max(0, frame.w - size.w * scale);
    const h = Math.max(0, frame.h - size.h * scale);
    onChange({
      x: w ? Math.min(1, Math.max(0, nextLeft / w)) : 0,
      y: h ? Math.min(1, Math.max(0, nextTop / h)) : 1,
      scale,
    });
  };

  // Resize around the card's centre.
  const resize = (scale: number) => {
    const next = clampScale(scale);
    const cx = left + (size.w * layout.scale) / 2;
    const cy = top + (size.h * layout.scale) / 2;
    place(cx - (size.w * next) / 2, cy - (size.h * next) / 2, next);
  };

  const onPointerDown = (event: React.PointerEvent) => {
    // Buttons on the card (Buy, the toolbar) keep working normally.
    if ((event.target as HTMLElement).closest("button, a")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      setGesture({ kind: "pinch", distance: Math.hypot(a.x - b.x, a.y - b.y), scale: layout.scale });
    } else {
      setGesture({ kind: "drag", px: event.clientX, py: event.clientY, left, top });
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (gesture?.kind === "pinch" && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      resize((gesture.scale * Math.hypot(a.x - b.x, a.y - b.y)) / gesture.distance);
    } else if (gesture?.kind === "drag") {
      place(gesture.left + event.clientX - gesture.px, gesture.top + event.clientY - gesture.py, layout.scale);
    }
  };

  const onPointerEnd = (event: React.PointerEvent) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) {
      // A tap without moving shows the size buttons.
      if (gesture?.kind === "drag" && Math.hypot(event.clientX - gesture.px, event.clientY - gesture.py) < 6) setTools((value) => !value);
      setGesture(null);
    } else if (pointers.current.size === 1) {
      const [only] = [...pointers.current.values()];
      setGesture({ kind: "drag", px: only.x, py: only.y, left, top });
    }
  };

  return (
    <div ref={frameRef} className="pointer-events-none absolute inset-3 z-[15]">
      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onWheel={(event) => resize(layout.scale * (event.deltaY < 0 ? 1.08 : 1 / 1.08))}
        style={{
          left,
          top,
          transform: `scale(${layout.scale})`,
          transformOrigin: "top left",
          touchAction: "none",
          visibility: frame.w ? "visible" : "hidden",
        }}
        className={`pointer-events-auto absolute w-[min(calc(100vw-2rem),360px)] select-none ${gesture ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div className={`rounded-2xl ${gesture || tools ? "ring-2 ring-violet-400" : ""}`}>{children}</div>
        {tools && (
          <div className="absolute -top-11 left-0 flex items-center gap-1 rounded-full bg-black/75 p-1 text-white backdrop-blur">
            <span className="flex items-center gap-1 px-2 text-[11px] text-white/75">
              <Move size={12} /> Drag
            </span>
            <button type="button" onClick={() => resize(layout.scale - 0.15)} aria-label="Make product smaller" className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/15">
              <Minus size={14} />
            </button>
            <button type="button" onClick={() => resize(layout.scale + 0.15)} aria-label="Make product bigger" className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/15">
              <Plus size={14} />
            </button>
            {onReset && (
              <button type="button" onClick={onReset} className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold hover:bg-white/15">
                {resetLabel ?? "Reset"}
              </button>
            )}
            <button type="button" onClick={() => setTools(false)} aria-label="Done" className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/15">
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
