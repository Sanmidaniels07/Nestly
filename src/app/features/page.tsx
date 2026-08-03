"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Users2,
  CalendarDays,
  MessageCircle,
  Bell,
  ShoppingBag,
  Check,
  ArrowRight,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import GuestGuard from "@/src/components/guards/GuestGuard";

interface Feature {
  icon: typeof Users;
  color: string;
  bg: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
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
  },
  {
    icon: CalendarDays,
    color: "#EC4899",
    bg: "#FCE7F3",
    eyebrow: "Events",
    title: "Never miss what matters",
    description:
      "Create events, invite your circle, and keep everyone in the loop with RSVPs and live discussion threads right on the event page.",
    points: ["One-tap RSVP", "Event-only comment threads", "Reminders as the date gets close"],
  },
  {
    icon: MessageCircle,
    color: "#10B981",
    bg: "#D1FAE5",
    eyebrow: "Messaging",
    title: "Conversations, in real time",
    description:
      "Direct messages that feel instant — typing indicators, live delivery, and a inbox that keeps every conversation exactly where you left it.",
    points: ["Real-time delivery", "One-on-one conversations", "Picks up right where you left off"],
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
  },
  {
    icon: ShoppingBag,
    color: "#FF7A45",
    bg: "#FFF0E8",
    eyebrow: "Marketplace",
    title: "Buy, sell, done",
    description:
      "A full marketplace built in — open a store, list products, and get paid securely. Buyers get order tracking from checkout to delivery.",
    points: ["Your own storefront", "Secure checkout", "Live order tracking"],
  },
];

export default function FeaturesPage() {
  return (
    <GuestGuard>
      <main className="min-h-screen overflow-x-hidden bg-[#F5F7FA] pb-24 pt-32 text-[#1A1A2E]">
        <section className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold text-violet-700">
              Everything, in one nest
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tighter md:text-6xl">
              One app. Every reason
              <br />
              to open it.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#6B7280] md:text-xl">
              Nestly brings your social life, your communities, and your marketplace
              together — no more switching apps to stay connected.
            </p>
          </motion.div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl space-y-28 px-6">
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
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

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
                  className="rounded-2xl bg-white px-9 py-6 text-base font-semibold text-[#2A1B4D] shadow-lg hover:bg-white/90"
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
    </GuestGuard>
  );
}

function FeatureRow({ feature, reversed }: { feature: Feature; reversed: boolean }) {
  const Icon = feature.icon;

  return (
    <div
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
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: feature.bg, color: feature.color }}
        >
          <Icon size={28} />
        </div>

        <p
          className="mt-6 text-[12.5px] font-bold uppercase tracking-[0.2em]"
          style={{ color: feature.color }}
        >
          {feature.eyebrow}
        </p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight">{feature.title}</h3>
        <p className="mt-4 text-[16px] leading-relaxed text-[#6B7280]">
          {feature.description}
        </p>

        <ul className="mt-6 space-y-3">
          {feature.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-[14.5px] text-[#374151]">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: feature.bg, color: feature.color }}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="md:[direction:ltr]"
      >
        <FeatureVisual feature={feature} />
      </motion.div>
    </div>
  );
}

function FeatureVisual({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-xl"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, ${feature.bg} 0%, transparent 60%)`,
      }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-28 w-28 items-center justify-center rounded-3xl shadow-lg"
        style={{ backgroundColor: feature.color }}
      >
        <Icon size={48} className="text-white" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute right-8 top-8 h-4 w-4 rounded-full"
        style={{ backgroundColor: feature.color, opacity: 0.5 }}
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 left-10 h-6 w-6 rounded-full"
        style={{ backgroundColor: feature.color, opacity: 0.3 }}
      />
    </div>
  );
}
