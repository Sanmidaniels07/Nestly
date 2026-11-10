"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Users2,
  CalendarDays,
  Gift,
  MessageCircle,
  Bell,
  ShoppingBag,
  Check,
  ArrowRight,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import GuestGuard from "@/src/components/guards/GuestGuard";
import SiteFooter from "@/src/components/layout/site-footer";
import {
  BirthdayDemo,
  ChatDemo,
  CommunityDemo,
  EventDemo,
  FeedDemo,
  HeroChips,
  HeroGlow,
  MarketDemo,
  NotificationsDemo,
} from "@/src/components/marketing/demos";

interface Feature {
  icon: typeof Users;
  color: string;
  bg: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  demo: () => React.JSX.Element;
  screen: string;
}

const features: Feature[] = [
  {
    icon: Users,
    color: "#2B7FFF",
    bg: "#E8F1FF",
    eyebrow: "Social",
    title: "A feed that's actually yours",
    description:
      "Share updates, photos, and moments with the people who matter. React, comment, and keep conversations going without the noise.",
    points: ["Posts with photos & video", "Likes, comments, hashtags", "Follow the people you care about"],
    demo: FeedDemo,
    screen: "Home feed",
  },
  {
    icon: Gift,
    color: "#F43F5E",
    bg: "#FFE4E6",
    eyebrow: "Birthdays",
    title: "Never miss a birthday",
    description:
      "Get a heads-up before the people you follow celebrate. Send a wish in a tap, or pick a gift straight from their wishlist.",
    points: ["Reminders before the day", "Wishlists to gift from", "Your age always stays private"],
    demo: BirthdayDemo,
    screen: "Birthdays",
  },
  {
    icon: Users2,
    color: "#8B5CF6",
    bg: "#F3EEFD",
    eyebrow: "Communities",
    title: "Find your people",
    description:
      "Join or start communities built around what you're into — from hobbies to hustle. Every community gets its own space to post, discuss, and grow together.",
    points: ["Public & focused discussions", "Member-only posting", "Your own community, your rules"],
    demo: CommunityDemo,
    screen: "Communities",
  },
  {
    icon: CalendarDays,
    color: "#EC4899",
    bg: "#FCE7F3",
    eyebrow: "Events",
    title: "Plans everyone shows up to",
    description:
      "Create events, invite your circle, and keep everyone in the loop with RSVPs and live discussion threads right on the event page.",
    points: ["One-tap RSVP", "Event-only comment threads", "Reminders as the date gets close"],
    demo: EventDemo,
    screen: "Events",
  },
  {
    icon: MessageCircle,
    color: "#10B981",
    bg: "#D1FAE5",
    eyebrow: "Messaging",
    title: "Conversations, in real time",
    description:
      "Direct messages that feel instant — typing indicators, live delivery, and an inbox that keeps every conversation exactly where you left it.",
    points: ["Real-time delivery", "One-on-one conversations", "Picks up right where you left off"],
    demo: ChatDemo,
    screen: "Messages",
  },
  {
    icon: Bell,
    color: "#F59E0B",
    bg: "#FEF3C7",
    eyebrow: "Notifications",
    title: "Know the moment it happens",
    description:
      "Every like, comment, follow, and sale lands in one place — and clicking one takes you straight to what it's about, not a generic inbox.",
    points: ["Real-time delivery", "Deep-links to the source", "Fine-tune what you hear about"],
    demo: NotificationsDemo,
    screen: "Notifications",
  },
  {
    icon: ShoppingBag,
    color: "#FF7A45",
    bg: "#FFF0E8",
    eyebrow: "Marketplace",
    title: "Buy, sell, done",
    description:
      "A full marketplace built in — open a store, list products, and get paid securely. Buyers get order tracking from checkout to delivery.",
    points: ["Your own storefront", "Secure Paystack checkout", "Live order tracking"],
    demo: MarketDemo,
    screen: "Marketplace",
  },
];

export default function FeaturesPage() {
  return (
    <GuestGuard>
      <main className="min-h-screen overflow-x-hidden bg-canvas pb-24 pt-32 text-ink">
        <section className="relative isolate mx-auto max-w-6xl px-6 py-6 text-center">
          <HeroGlow />
          <HeroChips />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-500/15 px-4 py-1.5 text-[13px] font-semibold text-violet-700 dark:text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600" />
              </span>
              Everything, in one nest
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tighter md:text-6xl">
              One app. Every reason
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">to open it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl">
              Nestly brings your social life, your celebrations, your communities and a marketplace of trusted sellers
              together — no more switching apps to stay connected.
            </p>
          </motion.div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl space-y-20 px-4 sm:space-y-28 sm:px-6">
          {features.map((feature, i) => (
            <FeatureRow key={feature.title} feature={feature} reversed={i % 2 === 1} />
          ))}
        </section>

        <section className="mx-auto mt-28 max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-8 py-16 text-center text-white sm:px-16"
          >
            <motion.div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />

            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to move in?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/80">
              It takes less than a minute to create your account and start exploring.
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-2xl bg-white px-9 py-6 text-base font-semibold text-[#2A1B4D] shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Join free
                </Button>
              </Link>
              <Link
                href="/preview"
                className="group flex items-center gap-1.5 px-4 py-3 text-[14.5px] font-semibold text-white/90 hover:text-white"
              >
                See it in action
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </GuestGuard>
  );
}

function FeatureRow({ feature, reversed }: { feature: Feature; reversed: boolean }) {
  const Icon = feature.icon;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Gentle parallax: the demo drifts a little against the scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
        reversed ? "md:[direction:rtl]" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="md:[direction:ltr]"
      >
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: feature.bg, color: feature.color }}
          whileHover={{ rotate: -8, scale: 1.08 }}
        >
          <Icon size={28} />
        </motion.div>

        <p
          className="mt-6 text-[12.5px] font-bold uppercase tracking-[0.2em]"
          style={{ color: feature.color }}
        >
          {feature.eyebrow}
        </p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight">{feature.title}</h3>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          {feature.description}
        </p>

        <ul className="mt-6 space-y-3">
          {feature.points.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex items-center gap-2.5 text-[14.5px] text-ink-2"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: feature.bg, color: feature.color }}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              {point}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ y }}
        className="md:[direction:ltr]"
      >
        <FeatureVisual feature={feature} />
      </motion.div>
    </div>
  );
}

// A little "app window" playing a live demo of the feature.
function FeatureVisual({ feature }: { feature: Feature }) {
  const Demo = feature.demo;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface p-3 shadow-xl sm:rounded-[32px] sm:p-8"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 10%, ${feature.bg} 0%, transparent 55%), radial-gradient(circle at 90% 100%, ${feature.bg} 0%, transparent 45%)`,
      }}
    >
      <div className="@container mx-auto max-w-sm overflow-hidden rounded-3xl border border-line-soft bg-canvas/80 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 border-b border-line-soft px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-[12px] font-semibold text-subtle">{feature.screen}</span>
          <span className="ml-auto flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: feature.color }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: feature.color }} /> Live
          </span>
        </div>
        <div className="p-3 sm:p-4">
          <Demo />
        </div>
      </div>
    </div>
  );
}
