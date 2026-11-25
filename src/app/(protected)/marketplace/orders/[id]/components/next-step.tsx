"use client";

import { CheckCircle2, ChefHat, CircleSlash, Clock3, KeyRound, PackageCheck, Star, Truck } from "lucide-react";

import { Order } from "@/src/types/order";

interface Step {
  icon: typeof Clock3;
  title: string;
  body: string;
  tone: "violet" | "amber" | "emerald" | "muted";
  // Scrolls to the part of the page where it's done.
  action?: { label: string; target: string };
  // 1-4: placed, preparing, on its way, delivered.
  progress?: number;
}

const TONES = {
  violet: "border-violet-200 bg-violet-50/70 dark:border-violet-500/30 dark:bg-violet-500/10",
  amber: "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10",
  emerald: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10",
  muted: "border-line bg-surface",
};
const ICON_TONES = {
  violet: "bg-violet-600 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-600 text-white",
  muted: "bg-surface-2 text-muted",
};

const STAGES = ["Placed", "Preparing", "On its way", "Delivered"];

// Where the order is, in one sentence, and the one thing to do now (if
// anything). The details below stay as they are.
export function nextStep(order: Order): Step {
  const items = order.items.filter((item) => item.status !== "CANCELLED");
  const isPickup = (order.shipping ?? []).length > 0 && (order.shipping ?? []).every((s) => s.type === "PICKUP");

  if (order.status === "PENDING") {
    return { icon: Clock3, title: "Waiting for payment", body: "This order hasn't been paid, so the seller hasn't been told about it yet.", tone: "muted" };
  }
  if (order.status === "CANCELLED" || items.length === 0) {
    return {
      icon: CircleSlash,
      title: "This order was cancelled",
      body: "If you paid, your money goes back to the card or account you paid with.",
      tone: "muted",
    };
  }
  if (items.some((item) => item.awaitingConfirmation)) {
    return {
      icon: PackageCheck,
      title: "The seller says it's delivered",
      body: "Got it and it's all fine? Confirm it so the seller is paid. Something wrong? Report it before you confirm.",
      tone: "amber",
      action: { label: "Confirm or report", target: "order-items" },
      progress: 4,
    };
  }
  if (items.some((item) => item.status === "SHIPPED")) {
    return {
      icon: isPickup ? KeyRound : Truck,
      title: isPickup ? "Ready for pickup" : "On its way to you",
      body: isPickup
        ? "Go and collect it, and give the seller your pickup code once you have your items."
        : "When it arrives, check it, then give your delivery code to the person delivering.",
      tone: "violet",
      action: { label: "Show my code", target: "delivery-codes" },
      progress: 3,
    };
  }
  if (items.some((item) => item.status === "PROCESSING")) {
    return { icon: ChefHat, title: "The seller is preparing your order", body: "We'll let you know the moment it's on its way.", tone: "violet", progress: 2 };
  }
  if (items.some((item) => item.status === "PENDING")) {
    return {
      icon: CheckCircle2,
      title: "Order placed - you're all set",
      body: "Your payment is held safely by Nestly. The seller has been told and will start on it soon.",
      tone: "emerald",
      progress: 1,
    };
  }
  return {
    icon: Star,
    title: "Delivered - enjoy!",
    body: "How was it? A quick review helps other buyers and the seller.",
    tone: "emerald",
    action: { label: "Write a review", target: "order-items" },
    progress: 4,
  };
}

export default function NextStep({ order }: { order: Order }) {
  const step = nextStep(order);
  const Icon = step.icon;

  const go = (target: string) => {
    const el = document.getElementById(target);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Show the code straight away when that's what they asked for.
    if (target === "delivery-codes") el.querySelector<HTMLButtonElement>("button[aria-pressed='false']")?.click();
  };

  return (
    <section className={`rounded-2xl border p-5 sm:p-6 ${TONES[step.tone]}`} aria-live="polite">
      <div className="flex items-start gap-3.5">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${ICON_TONES[step.tone]}`}>
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-subtle">What&apos;s next</p>
          <h2 className="mt-0.5 text-[17px] font-semibold leading-snug text-ink">{step.title}</h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{step.body}</p>
        </div>
      </div>

      {step.progress && (
        <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label="Order progress">
          {STAGES.map((label, index) => {
            const done = index < step.progress!;
            return (
              <li key={label} className="min-w-0">
                <span className={`block h-1.5 rounded-full ${done ? "bg-violet-600 dark:bg-violet-400" : "bg-track"}`} />
                <span className={`mt-1.5 block truncate text-[11px] ${done ? "font-semibold text-ink-2" : "text-subtle"}`}>{label}</span>
              </li>
            );
          })}
        </ol>
      )}

      {step.action && (
        <button
          type="button"
          onClick={() => go(step.action!.target)}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(91,33,182,0.7)] transition-all hover:brightness-110 active:scale-[0.99] sm:w-auto sm:px-6"
        >
          {step.action.label}
        </button>
      )}
    </section>
  );
}
