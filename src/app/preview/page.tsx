"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Users2,
  CalendarDays,
  MessageCircle,
  ShoppingBag,
  Truck,
  Gift,
  Store,
  ArrowRight,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import Card from "@/src/components/ui/card";
import GuestGuard from "@/src/components/guards/GuestGuard";
import SiteFooter from "@/src/components/layout/site-footer";
import TourVideo from "@/src/components/marketing/tour-video";
import {
  BirthdayDemo,
  ChatDemo,
  CommunityDemo,
  EventDemo,
  FeedDemo,
  HeroChips,
  HeroGlow,
  MarketDemo,
  SellerDemo,
  TrackingDemo,
} from "@/src/components/marketing/demos";

function MockCard({
  icon: Icon,
  color,
  label,
  children,
  className = "",
}: {
  icon: typeof Users;
  color: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`h-full overflow-hidden rounded-3xl border-line-strong p-0 transition-shadow duration-300 hover:shadow-2xl sm:rounded-[28px] ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-line-soft bg-surface px-4 py-3.5 sm:px-5 sm:py-4">
        <Icon size={17} style={{ color }} />
        <span className="text-[13.5px] font-semibold text-ink">{label}</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: color }} /> Live
        </span>
      </div>
      {/* Tighter on phones so the demo gets the width. */}
      <div className="@container bg-canvas/50 p-3 sm:p-5">{children}</div>
    </Card>
  );
}

const CARDS = [
  { icon: Users, color: "#2B7FFF", label: "Social Feed", demo: FeedDemo },
  { icon: Gift, color: "#F43F5E", label: "Birthdays", demo: BirthdayDemo },
  { icon: Users2, color: "#8B5CF6", label: "Communities", demo: CommunityDemo },
  { icon: CalendarDays, color: "#EC4899", label: "Events", demo: EventDemo },
  { icon: MessageCircle, color: "#10B981", label: "Real-time Messaging", demo: ChatDemo },
  { icon: Store, color: "#7C3AED", label: "Seller Dashboard", demo: SellerDemo },
  { icon: ShoppingBag, color: "#FF7A45", label: "Marketplace", demo: MarketDemo, wide: true },
  { icon: Truck, color: "#0EA5E9", label: "Order Tracking", demo: TrackingDemo, wide: true },
];

export default function PreviewPage() {
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
            <span className="inline-flex items-center gap-2 rounded-full bg-tint-blue px-4 py-1.5 text-[13px] font-semibold text-[#2B7FFF]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2B7FFF] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2B7FFF]" />
              </span>
              A closer look
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tighter md:text-6xl">
              See Nestly
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">in action</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl">
              Watch what&apos;s waiting for you inside — your feed, birthdays, communities, messages, and a marketplace of
              trusted sellers.
            </p>
          </motion.div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl px-6">
          <TourVideo />
        </section>

        <section className="mx-auto mt-20 grid max-w-6xl gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-2">
          {CARDS.map((card, i) => {
            const Demo = card.demo;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                whileHover={{ y: -4 }}
                className={card.wide ? "md:col-span-2" : ""}
              >
                <MockCard icon={card.icon} color={card.color} label={card.label}>
                  <Demo />
                </MockCard>
              </motion.div>
            );
          })}
        </section>

        <section className="mx-auto mt-24 max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-8 py-16 text-center text-white sm:px-16"
          >
            <motion.div
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />

            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
              This could be your feed.
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/80">
              Create your account and start building your own — free, in under a minute.
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
                href="/features"
                className="group flex items-center gap-1.5 px-4 py-3 text-[14.5px] font-semibold text-white/90 hover:text-white"
              >
                Explore all features
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
