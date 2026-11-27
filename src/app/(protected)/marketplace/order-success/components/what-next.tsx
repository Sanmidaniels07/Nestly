"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChefHat, Eye, EyeOff, KeyRound, MapPin, PartyPopper, Truck } from "lucide-react";

import { Order } from "@/src/types/order";
import { RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { formatRelativeTime } from "@/src/lib/date";
import { hasPerishable, isPickupOrder, money, shopsIn } from "./order-helpers";

interface Step {
  icon: typeof Check;
  title: string;
  body: React.ReactNode;
  state: "done" | "now" | "later";
}

// The road from "paid" to "enjoying it", for this order: who's preparing it,
// how it reaches you, the code that protects you, and the report window.
export default function WhatNext({ order }: { order: Order }) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const shops = shopsIn(order);
  const pickup = isPickupOrder(order);
  const codes = shops.filter((shop) => shop.shipping?.deliveryCode);
  const perishable = hasPerishable(order);
  const allPerishable = order.items.length > 0 && order.items.every((item) => item.perishable);

  const reportWindow = allPerishable
    ? "24 hours"
    : perishable
      ? `${RETURN_WINDOW_DAYS} days (24 hours for food and other perishables)`
      : `${RETURN_WINDOW_DAYS} days`;

  const deliveryBody = (
    <div className="space-y-1.5">
      {shops.map((shop) => {
        const shipment = shop.shipping;
        return (
          <p key={shop.id} className="flex items-start gap-1.5">
            {shipment?.type === "PICKUP" ? (
              <MapPin size={13} className="mt-[3px] shrink-0 text-violet-500" />
            ) : (
              <Truck size={13} className="mt-[3px] shrink-0 text-violet-500" />
            )}
            <span>
              {shops.length > 1 && <strong className="font-semibold text-ink-2">{shop.name}: </strong>}
              {shipment?.type === "PICKUP"
                ? `Collect it at ${shipment.pickupAddress || "the seller's store"} once they say it's ready.`
                : shipment
                  ? `${shipment.optionName}${shipment.eta ? ` · ${shipment.eta}` : ""}${order.address?.city ? ` to ${order.address.city}` : ""}.`
                  : "The seller will arrange delivery with you."}
            </span>
          </p>
        );
      })}
    </div>
  );

  const steps: Step[] = [
    {
      icon: Check,
      title: "Payment received",
      body: `${money(order.total)} paid securely ${formatRelativeTime(order.createdAt)}.`,
      state: "done",
    },
    {
      icon: ChefHat,
      title: shops.length > 1 ? "Your sellers get it ready" : `${shops[0]?.name ?? "The seller"} gets it ready`,
      body: `They've been told about your order. We'll notify you and email you when it's ${pickup ? "ready to collect" : "on its way"}.`,
      state: "now",
    },
    {
      icon: pickup ? MapPin : Truck,
      title: pickup ? "Pick it up" : "It comes to you",
      body: deliveryBody,
      state: "later",
    },
    {
      icon: KeyRound,
      title: `Hand over your ${pickup ? "pickup" : "delivery"} code`,
      body: (
        <div>
          <p>
            Give it to the {pickup ? "seller when you collect" : "person delivering"} <strong className="font-semibold text-ink-2">only once you have your items</strong>. It confirms you
            received them.
          </p>
          {codes.length > 0 && (
            <div className="mt-3 rounded-2xl border border-violet-200 bg-violet-50/70 p-3 dark:border-violet-500/30 dark:bg-violet-500/10">
              <div className="space-y-2">
                {codes.map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-[12.5px] text-muted">{codes.length > 1 ? shop.name : "Your code"}</span>
                    <span
                      className="font-[family-name:var(--font-mono)] text-[20px] font-bold tracking-[0.28em] text-violet-700 dark:text-violet-300"
                      aria-label={revealed ? `Code ${shop.shipping?.deliveryCode}` : "Code hidden"}
                    >
                      {revealed ? shop.shipping?.deliveryCode : "••••••"}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRevealed((value) => !value)}
                aria-pressed={revealed}
                className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealed ? "Hide code" : "Show code"}
              </button>
              <p className="mt-1.5 text-[11.5px] text-subtle">It&apos;s always on your order page too.</p>
            </div>
          )}
        </div>
      ),
      state: "later",
    },
    {
      icon: PartyPopper,
      title: "Check it and enjoy",
      body: `Something not right? You have ${reportWindow} after you receive it to report a problem from your order page.`,
      state: "later",
    },
  ];

  return (
    <section className="rounded-[24px] border border-line bg-surface p-5 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] text-ink">What happens next</h2>

      <ol className="mt-5">
        {steps.map((step, index) => {
          const last = index === steps.length - 1;
          return (
            <motion.li
              key={step.title}
              className="relative flex gap-4 pb-6 last:pb-0"
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.9 + index * 0.08 }}
            >
              {!last && (
                <span
                  aria-hidden
                  className={`absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-[2px] rounded-full ${step.state === "done" ? "bg-violet-500" : "bg-track"}`}
                />
              )}
              <span className="relative shrink-0">
                {step.state === "now" && !reduce && (
                  <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-violet-400/40" />
                )}
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full ${
                    step.state === "done"
                      ? "bg-violet-600 text-white"
                      : step.state === "now"
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white ring-4 ring-violet-100 dark:ring-violet-500/20"
                        : "border border-line-strong bg-surface text-muted"
                  }`}
                >
                  <step.icon size={17} />
                </span>
              </span>
              <div className="min-w-0 flex-1 pt-1.5">
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                  {step.title}
                  {step.state === "now" && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                      Now
                    </span>
                  )}
                </p>
                <div className="mt-1 text-[13.5px] leading-relaxed text-muted">{step.body}</div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
