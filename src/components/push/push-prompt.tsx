"use client";

import { useState, useSyncExternalStore } from "react";
import { BellRing, Share, X } from "lucide-react";

import { usePush } from "@/src/hooks/use-push";

const HIDE_KEY = "nestly.pushPrompt.hiddenAt";
const HIDE_FOR_MS = 14 * 24 * 60 * 60 * 1000;
const subscribeNoop = () => () => {};

const isHidden = () => {
  try {
    const at = Number(localStorage.getItem(HIDE_KEY));
    return !!at && Date.now() - at < HIDE_FOR_MS;
  } catch {
    return false;
  }
};

// Dashboard nudge to turn on push notifications on this device (or, on an
// iPhone in Safari, how to add Nestly to the Home Screen first). Only shows
// while the browser hasn't been asked yet; "Not now" hides it for 2 weeks.
export default function PushPrompt() {
  const { state, busy, turnOn } = usePush();
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [hiddenNow, setHiddenNow] = useState(false);

  if (!isClient || hiddenNow || isHidden()) return null;
  const askable = state === "off" && Notification.permission === "default";
  if (!askable && state !== "needs-home-screen") return null;

  const hide = () => {
    setHiddenNow(true);
    try {
      localStorage.setItem(HIDE_KEY, String(Date.now()));
    } catch {
      // Storage unavailable - it shows again next visit.
    }
  };

  return (
    <section className="relative flex flex-col gap-4 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-surface to-sky-50 p-5 pr-12 dark:border-violet-500/25 dark:from-violet-500/10 dark:via-surface dark:to-sky-500/10 sm:flex-row sm:items-center sm:p-6 sm:pr-14">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-white shadow-[0_10px_24px_-10px_rgba(124,58,237,0.6)]">
        <BellRing size={22} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">Never miss a message or an order</p>
        {state === "needs-home-screen" ? (
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            On iPhone, add Nestly to your Home Screen to get notifications: tap{" "}
            <Share size={13} className="inline -translate-y-px" aria-label="Share" /> <strong className="font-semibold text-ink-2">Share</strong>, then{" "}
            <strong className="font-semibold text-ink-2">Add to Home Screen</strong>. Open Nestly from there and turn them on.
          </p>
        ) : (
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Get notified on this device about messages, orders, followers and more - even when Nestly isn&apos;t open.
          </p>
        )}
      </div>

      {state !== "needs-home-screen" && (
        <button
          onClick={() => turnOn()}
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Turning on…" : "Turn on notifications"}
        </button>
      )}

      <button
        onClick={hide}
        aria-label="Not now"
        title="Not now"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-subtle transition hover:bg-surface-2 hover:text-ink"
      >
        <X size={16} />
      </button>
    </section>
  );
}
