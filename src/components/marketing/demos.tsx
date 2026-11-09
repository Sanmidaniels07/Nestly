"use client";

// Self-playing mini demos of Nestly for the public Features and Preview
// pages. Each one loops through a few "steps" while it is on screen, pauses
// when scrolled away, and shows its finished state (no motion) for people
// who prefer reduced motion. Names, stores and amounts are illustrative.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Bell,
  Check,
  Gift,
  Heart,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Truck,
  Users2,
  Wallet,
} from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 420, damping: 30 };
const enter = { initial: { opacity: 0, y: 14, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10 } };

/** Steps through `durations.length` states while visible; finished state if motion is reduced. */
function useSteps(durations: readonly number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const timer = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step] ?? 1500);
    return () => clearTimeout(timer);
  }, [step, inView, reduce, durations]);

  return { ref, step: reduce ? durations.length - 1 : step };
}

/** A number that rolls when it changes. */
function Roll({ value, className = "" }: { value: string | number; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Avatar({ from, to, label }: { from: string; to: string; label: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {label}
    </div>
  );
}

/** A tap ripple shown when a demo "presses" a button. */
function Tap({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white/40"
          initial={{ opacity: 0.8, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Feed: a new post slides in, gets a like and a comment.
const FEED_STEPS = [1400, 1500, 1300, 1700, 2400] as const;

export function FeedDemo() {
  const { ref, step } = useSteps(FEED_STEPS);
  const liked = step >= 2;

  return (
    <div ref={ref} className="flex h-[300px] flex-col gap-3 overflow-hidden">
      <AnimatePresence initial={false}>
        {step >= 1 && (
          <motion.div key="new" layout {...enter} transition={SPRING} className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar from="#FB923C" to="#EA580C" label="T" />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-ink">
                  Tunde&apos;s Kitchen <span className="font-normal text-subtle">· just now</span>
                </p>
                <p className="text-[13px] text-muted">Fresh jollof trays are back this weekend! 🍛</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-5 pl-12 text-subtle">
              <span className="relative flex items-center gap-1.5 text-[12.5px]">
                <motion.span animate={liked ? { scale: [1, 1.45, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
                  <Heart size={15} className={liked ? "fill-rose-500 text-rose-500" : ""} />
                </motion.span>
                <Roll value={liked ? 12 : 11} />
              </span>
              <span className="flex items-center gap-1.5 text-[12.5px]">
                <MessageSquare size={14} /> <Roll value={step >= 3 ? 4 : 3} />
              </span>
            </div>
            <AnimatePresence>
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="ml-12 mt-3 rounded-xl bg-surface-muted px-3 py-2 text-[12.5px] text-ink-2">
                    <span className="font-semibold">Chioma</span> Saving this for Saturday 😍
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout transition={SPRING} className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar from="#60A5FA" to="#2563EB" label="A" />
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-ink">
              Ada Okafor <span className="font-normal text-subtle">· 2h</span>
            </p>
            <p className="text-[13px] text-muted">Birthday dinner with the crew 🎉</p>
          </div>
        </div>
        <div className="ml-12 mt-3 h-20 rounded-xl bg-gradient-to-br from-violet-200 via-pink-200 to-amber-100 dark:from-violet-500/30 dark:via-pink-500/20 dark:to-amber-500/10" />
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Communities: join, then new discussions arrive.
const COMMUNITY_STEPS = [1500, 1400, 1600, 2600] as const;

export function CommunityDemo() {
  const { ref, step } = useSteps(COMMUNITY_STEPS);
  const joined = step >= 1;
  const threads = [
    { text: "Best suya spot in Lekki? 👀", meta: "18 replies" },
    { text: "Weekend meetup at the park", meta: "42 going" },
  ].slice(0, Math.max(0, step - 1));

  return (
    <div ref={ref} className="flex h-[300px] flex-col gap-3 overflow-hidden">
      <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-[26px] dark:bg-violet-500/15">🍲</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-semibold text-ink">Lagos Foodies</p>
            <p className="text-[12.5px] text-subtle">
              <Roll value={joined ? "3,202" : "3,201"} /> members
            </p>
            <div className="mt-2 flex -space-x-2">
              {["#F87171", "#FBBF24", "#34D399", "#60A5FA"].map((c) => (
                <div key={c} className="h-6 w-6 rounded-full border-2 border-surface" style={{ backgroundColor: c }} />
              ))}
              <AnimatePresence>
                {joined && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-violet-600 text-[10px] font-bold text-white"
                  >
                    You
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.span
            layout
            className={`relative overflow-hidden rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
              joined ? "border border-violet-200 text-violet-600 dark:border-violet-500/30 dark:text-violet-300" : "bg-violet-600 text-white"
            }`}
          >
            <Tap show={step === 1} />
            {joined ? (
              <span className="flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> Joined
              </span>
            ) : (
              "Join"
            )}
          </motion.span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {threads.map((t) => (
          <motion.div key={t.text} layout {...enter} transition={SPRING} className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
            <Users2 size={16} className="shrink-0 text-violet-500" />
            <p className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{t.text}</p>
            <span className="shrink-0 text-[11.5px] text-subtle">{t.meta}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Events: RSVP, a comment, then a reminder.
const EVENT_STEPS = [1500, 1400, 1500, 2600] as const;

export function EventDemo() {
  const { ref, step } = useSteps(EVENT_STEPS);
  const going = step >= 1;

  return (
    <div ref={ref} className="relative flex h-[300px] flex-col justify-center gap-3 overflow-hidden">
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={SPRING}
            className="absolute inset-x-0 top-0 flex items-center gap-2.5 rounded-2xl bg-ink px-4 py-3 text-[12.5px] text-surface shadow-lg"
          >
            <Bell size={15} className="shrink-0 text-amber-300" /> Rooftop Sunset Mixer starts tomorrow at 6 PM
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-500/15">
            <span className="text-[11px] font-bold uppercase text-pink-500">Aug</span>
            <span className="text-[20px] font-bold text-pink-500">15</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-semibold text-ink">Rooftop Sunset Mixer</p>
            <p className="text-[12.5px] text-subtle">
              6:00 PM · <Roll value={going ? 128 : 127} /> going
            </p>
          </div>
          <motion.span
            layout
            className={`relative flex items-center gap-1 overflow-hidden rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
              going ? "bg-pink-500 text-white" : "border border-pink-300 text-pink-500 dark:border-pink-500/40"
            }`}
          >
            <Tap show={step === 1} />
            {going ? (
              <>
                <Check size={12} strokeWidth={3} /> Going
              </>
            ) : (
              "RSVP"
            )}
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div {...enter} transition={SPRING} className="flex items-start gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
            <Avatar from="#F472B6" to="#DB2777" label="K" />
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-ink">Kemi</p>
              <p className="text-[12.5px] text-muted">Can&apos;t wait! Who&apos;s bringing the playlist? 🌅</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Messages: a buyer and seller chat, with typing indicators.
const CHAT_STEPS = [1100, 1300, 1100, 1300, 1100, 1300, 2400] as const;
const CHAT = [
  { me: false, text: "Hi! Is the red velvet box still available?" },
  { me: true, text: "Yes! Ready for pickup today 🎂" },
  { me: false, text: "Perfect, ordering now 🙌" },
];

function Typing({ me }: { me: boolean }) {
  return (
    <motion.div {...enter} className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-1 rounded-2xl px-4 py-3 ${me ? "bg-emerald-500/80" : "bg-surface-muted"}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${me ? "bg-white" : "bg-subtle"}`}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function ChatDemo() {
  const { ref, step } = useSteps(CHAT_STEPS);
  // Steps: typing, msg, typing, msg, typing, msg, hold.
  const shown = Math.min(CHAT.length, Math.floor((step + 1) / 2));
  const typingFor = step % 2 === 0 && step < 6 ? CHAT[step / 2] : null;

  return (
    <div ref={ref} className="flex h-[300px] flex-col justify-end gap-2.5 overflow-hidden">
      <AnimatePresence initial={false}>
        {CHAT.slice(0, shown).map((m) => (
          <motion.div key={m.text} layout {...enter} transition={SPRING} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] ${
                m.me ? "rounded-br-sm bg-emerald-500 text-white" : "rounded-bl-sm bg-surface-muted text-ink"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {typingFor && <Typing key={`typing-${step}`} me={typingFor.me} />}
      </AnimatePresence>
      <div className="h-4 text-right text-[11px] text-subtle">
        {step === 6 && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-1">
            <Check size={11} /> Seen
          </motion.span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notifications: alerts stack up on the bell.
const NOTIFY_STEPS = [1300, 1300, 1300, 1300, 2600] as const;
const NOTIFICATIONS = [
  { icon: Heart, color: "text-rose-500 bg-rose-100 dark:bg-rose-500/15", text: "Tolu liked your post" },
  { icon: Users2, color: "text-blue-500 bg-blue-100 dark:bg-blue-500/15", text: "Ada started following you" },
  { icon: ShoppingBag, color: "text-orange-500 bg-orange-100 dark:bg-orange-500/15", text: "New order · ₦24,000" },
  { icon: Gift, color: "text-violet-500 bg-violet-100 dark:bg-violet-500/15", text: "Chioma's birthday is tomorrow 🎂" },
];

export function NotificationsDemo() {
  const { ref, step } = useSteps(NOTIFY_STEPS);
  const count = Math.min(step + 1, NOTIFICATIONS.length);
  const visible = NOTIFICATIONS.slice(0, count).reverse();

  return (
    <div ref={ref} className="flex h-[300px] flex-col gap-3 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] font-semibold text-ink">Notifications</p>
        <span className="relative">
          <motion.span key={count} animate={{ rotate: [0, -18, 14, -8, 0] }} transition={{ duration: 0.6 }} className="block">
            <Bell size={18} className="text-ink-2" />
          </motion.span>
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            <Roll value={count} />
          </span>
        </span>
      </div>
      <AnimatePresence initial={false}>
        {visible.map((n) => {
          const Icon = n.icon;
          return (
            <motion.div key={n.text} layout {...enter} transition={SPRING} className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.color}`}>
                <Icon size={15} />
              </span>
              <p className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{n.text}</p>
              <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marketplace: add to cart, pay with Paystack.
const MARKET_STEPS = [1500, 1300, 1400, 1500, 2600] as const;

export function MarketDemo() {
  const { ref, step } = useSteps(MARKET_STEPS);
  const added = step >= 1;

  return (
    <div ref={ref} className="grid h-[300px] grid-cols-1 content-center gap-3 overflow-hidden @lg:grid-cols-[1.1fr_1fr] @lg:gap-4">
      <div className="flex min-w-0 gap-3 rounded-2xl border border-line-soft bg-surface p-3 shadow-sm @lg:block">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-300 to-rose-500 text-4xl @lg:h-28 @lg:w-auto">
          🧁
          <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-600">
            <Star size={11} className="fill-amber-500 text-amber-500" /> 4.9
          </span>
        </div>
        <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-ink @lg:mt-2.5">Red velvet cupcakes (12)</p>
        <p className="flex min-w-0 items-center gap-1 truncate text-[12px] text-subtle">
          <Store size={12} className="shrink-0" /> Sugar &amp; Spice · Ikeja
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-[family-name:var(--font-mono)] text-[14px] font-bold text-violet-600 dark:text-violet-400">₦24,000</p>
          <motion.span
            layout
            className={`relative flex items-center gap-1 overflow-hidden rounded-full px-3 py-1.5 text-[11.5px] font-semibold ${
              added ? "bg-emerald-500 text-white" : "bg-violet-600 text-white"
            }`}
          >
            <Tap show={step === 1} />
            {added ? (
              <>
                <Check size={12} strokeWidth={3} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={12} /> Add to cart
              </>
            )}
          </motion.span>
        </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-2.5">
        <div className="flex items-center justify-between rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <ShoppingCart size={15} /> Cart
          </span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[11px] font-bold text-white">
            <Roll value={added ? 1 : 0} />
          </span>
        </div>
        <AnimatePresence>
          {step >= 2 && (
            <motion.div {...enter} transition={SPRING} className="rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
              <p className="text-[12px] text-subtle">Checkout</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <ShieldCheck size={15} className="text-emerald-500" /> Paystack
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  {step >= 3 ? (
                    <motion.span key="paid" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <Check size={12} strokeWidth={3} /> Paid
                    </motion.span>
                  ) : (
                    <motion.span key="paying" exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[11.5px] text-subtle">
                      <motion.span className="h-3 w-3 rounded-full border-2 border-violet-500 border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                      Paying…
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {step >= 4 && (
            <motion.p {...enter} className="px-1 text-[12px] text-emerald-600 dark:text-emerald-400">
              Order placed · the seller has been notified
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order tracking: steps fill in, then the buyer confirms with their code.
const TRACK_STEPS = [1200, 1200, 1200, 1100, 1100, 1100, 1100, 2800] as const;
const STAGES = ["Placed", "Paid", "Shipped", "Delivered"];
const CODE = "4821";

export function TrackingDemo() {
  const { ref, step } = useSteps(TRACK_STEPS);
  const reached = Math.min(step, 3); // index of the furthest stage
  const digits = Math.max(0, Math.min(step - 3, 4));
  const confirmed = step >= 7;

  return (
    <div ref={ref} className="flex min-h-[200px] flex-col justify-center gap-6 overflow-hidden px-1">
      <div className="flex items-center">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : ""} bg-line-strong`}>
                <motion.div className="h-full bg-emerald-500" animate={{ width: i <= reached ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
              </div>
              <motion.div
                animate={i <= reached ? { scale: [0.8, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.45 }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  i <= reached ? "bg-emerald-500 text-white" : "bg-line-strong text-subtle"
                }`}
              >
                {i <= reached ? <Check size={14} strokeWidth={3} /> : i === 2 ? <Truck size={13} /> : <Package size={13} />}
              </motion.div>
              <div className={`h-0.5 flex-1 ${i === 3 ? "opacity-0" : ""} bg-line-strong`}>
                <motion.div className="h-full bg-emerald-500" animate={{ width: i < reached ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
              </div>
            </div>
            <span className={`mt-2 text-[11.5px] font-medium ${i <= reached ? "text-ink-2" : "text-subtle"}`}>{stage}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <p className="text-[12px] text-subtle">Confirm delivery with your private code</p>
        <div className="flex gap-2">
          {CODE.split("").map((d, i) => (
            <motion.span
              key={i}
              animate={i < digits ? { scale: [0.8, 1.1, 1] } : { scale: 1 }}
              className={`flex h-10 w-9 items-center justify-center rounded-xl border font-[family-name:var(--font-mono)] text-[16px] font-bold ${
                confirmed ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : i < digits ? "border-violet-400 text-ink" : "border-line-strong text-transparent"
              }`}
            >
              {i < digits ? d : "·"}
            </motion.span>
          ))}
        </div>
        <div className="h-5">
          <AnimatePresence>
            {confirmed && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={14} /> Delivery confirmed · order complete
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Birthdays: a reminder, a wishlist, a gift sent.
const BIRTHDAY_STEPS = [1500, 1400, 1400, 2800] as const;
const WISHLIST = [
  { emoji: "👜", name: "Ankara tote bag", price: "₦15,500" },
  { emoji: "🧴", name: "Shea glow set", price: "₦9,800" },
  { emoji: "🎧", name: "Wireless earbuds", price: "₦34,000" },
];

export function BirthdayDemo() {
  const { ref, step } = useSteps(BIRTHDAY_STEPS);

  return (
    <div ref={ref} className="relative flex h-[300px] flex-col gap-3 overflow-hidden">
      <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
        <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }} className="text-2xl">
          🎂
        </motion.span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-ink">Ada&apos;s birthday is tomorrow</p>
          <p className="text-[12px] text-subtle">Send a wish or a gift from her wishlist</p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {step >= 1 && (
          <motion.div {...enter} transition={SPRING} className="space-y-2">
            {WISHLIST.map((item, i) => {
              const picked = step >= 2 && i === 0;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className={`flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-colors ${
                    picked ? "border-violet-400 bg-violet-50 dark:bg-violet-500/10" : "border-line-soft bg-surface"
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <p className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{item.name}</p>
                  <span className="font-[family-name:var(--font-mono)] text-[12px] font-bold text-violet-600 dark:text-violet-400">{item.price}</span>
                  {picked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={SPRING}
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-[13px] font-semibold text-white shadow-lg"
          >
            <Gift size={16} /> Gift on its way to Ada 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seller dashboard: an order comes in, sales tick up, payment settles.
const SELLER_STEPS = [1600, 1400, 1500, 2800] as const;

export function SellerDemo() {
  const { ref, step } = useSteps(SELLER_STEPS);
  const sold = step >= 1;

  return (
    <div ref={ref} className="relative flex h-[300px] flex-col gap-3 overflow-hidden">
      <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
        <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.25em] text-subtle">This month</p>
        <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[28px] font-bold text-ink">
          ₦<Roll value={sold ? "184,500" : "160,500"} />
        </p>
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Roll value={sold ? 23 : 22} /> orders
          </span>
          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11.5px] font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">412 visits</span>
        </div>
        {/* tiny sales bars */}
        <div className="mt-3 flex h-10 items-end gap-1.5">
          {[30, 45, 38, 60, 52, 70, sold ? 92 : 64].map((h, i) => (
            <motion.div key={i} className="flex-1 rounded-t bg-violet-500/70" animate={{ height: `${h}%` }} transition={{ duration: 0.6 }} />
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {step >= 1 && (
          <motion.div key="order" layout {...enter} transition={SPRING} className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
              <ShoppingBag size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">New order · ₦24,000</p>
              <p className="text-[12px] text-subtle">Red velvet cupcakes × 1</p>
            </div>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div key="paid" layout {...enter} transition={SPRING} className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Wallet size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">Payment settled</p>
              <p className="text-[12px] text-subtle">Sent to your bank account</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Floating "live" chips for page heroes (decorative).
const CHIPS = [
  { text: "🎂 Ada's birthday is tomorrow", className: "left-[2%] top-[12%]", delay: 0 },
  { text: "❤️ Tolu liked your post", className: "right-[3%] top-[6%]", delay: 0.6 },
  { text: "🛍️ New order · ₦24,000", className: "left-[6%] bottom-[8%]", delay: 1.2 },
  { text: "✅ Delivery confirmed", className: "right-[5%] bottom-[14%]", delay: 1.8 },
];

export function HeroChips() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {CHIPS.map((chip, i) => (
        <motion.div
          key={chip.text}
          className={`absolute rounded-full border border-line-soft bg-surface/90 px-4 py-2 text-[13px] font-medium text-ink-2 shadow-lg backdrop-blur ${chip.className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, i % 2 ? 10 : -10, 0] }}
          transition={{
            opacity: { delay: 0.4 + chip.delay, duration: 0.5 },
            scale: { delay: 0.4 + chip.delay, duration: 0.5 },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: chip.delay },
          }}
        >
          {chip.text}
        </motion.div>
      ))}
    </div>
  );
}

/** Soft, slowly drifting colour blobs behind a hero. */
export function HeroGlow() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-pink-300/25 blur-3xl dark:bg-pink-600/15"
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
