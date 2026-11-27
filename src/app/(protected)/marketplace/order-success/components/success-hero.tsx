"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Gift } from "lucide-react";

import { Order } from "@/src/types/order";
import { useAuthStore } from "@/src/store/auth-store";
import { AnimatedTick, Confetti } from "./celebration";
import { money, shopsIn } from "./order-helpers";

// The moment of "it worked": who it's from, what's next in one line, and the
// order number to quote if they ever need help.
export default function SuccessHero({ order }: { order: Order }) {
  const firstName = useAuthStore((state) => state.user?.name?.trim().split(/\s+/)[0]);
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const shops = shopsIn(order);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderNumber = order.id.slice(-8).toUpperCase();
  const shopNames =
    shops.length === 0
      ? "The seller"
      : shops.length === 1
        ? shops[0].name
        : shops.length === 2
          ? `${shops[0].name} and ${shops[1].name}`
          : `${shops[0].name} and ${shops.length - 1} other shops`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked - the number is still on screen.
    }
  };

  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay } };

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-800 px-6 pb-8 pt-10 text-white shadow-[0_30px_70px_-30px_rgba(76,29,149,0.7)] sm:px-10 sm:pb-10 sm:pt-12">
      {/* Soft light behind the tick */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <Confetti />

      <div className="relative mx-auto max-w-2xl text-center">
        <AnimatedTick />

        <motion.p {...rise(0.45)} className="mt-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-200">
          {order.gift ? "Gift paid" : "Payment received"}
        </motion.p>

        <motion.h1 {...rise(0.55)} className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] leading-[1.1] sm:text-[44px]">
          {order.gift ? (
            <>
              Your gift for {order.gift.recipientName} is ready
              <Gift className="mb-1 ml-2 inline h-8 w-8 sm:h-10 sm:w-10" aria-hidden />
            </>
          ) : firstName ? (
            <>Order placed, {firstName}!</>
          ) : (
            <>Your order is placed!</>
          )}
        </motion.h1>

        <motion.p {...rise(0.65)} className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-violet-100 sm:text-[16px]">
          {order.gift
            ? "We'll let you know as soon as they accept it and add where it should go."
            : `${shopNames} ${shops.length > 1 ? "have" : "has"} been told and will start getting your order ready.`}
        </motion.p>

        <motion.div {...rise(0.75)} className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur">
            {money(order.total)} paid
          </span>
          <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[12.5px] font-semibold backdrop-blur transition hover:bg-white/25"
            aria-label={`Order number ${orderNumber}. Copy`}
          >
            #{orderNumber}
            {copied ? <Check size={13} /> : <Copy size={13} className="opacity-80" />}
            <span className="sr-only" aria-live="polite">
              {copied ? "Copied" : ""}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
