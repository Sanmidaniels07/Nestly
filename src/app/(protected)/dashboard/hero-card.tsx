"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Cake,
  CalendarDays,
  CheckCircle2,
  Compass,
  MessageCircle,
  Moon,
  Package,
  PenSquare,
  Store,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { UserDashboard } from "@/src/types/user-dashboard";
import { birthdayLabel, formatCount, plural } from "./format";

interface HeroCardProps {
  name: string;
  data?: UserDashboard;
  profileCompletion?: number;
}

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const themes: Record<TimeOfDay, { label: string; icon: typeof Sun; gradient: string; orb1: string; orb2: string }> = {
  morning: {
    label: "Good morning",
    icon: Sunrise,
    gradient: "from-[#4C2A85] via-[#B8557A] to-[#E8925B]",
    orb1: "bg-orange-300/20",
    orb2: "bg-fuchsia-400/10",
  },
  afternoon: {
    label: "Good afternoon",
    icon: Sun,
    gradient: "from-[#1E3A5F] via-[#3E5C9A] to-[#6D8CC7]",
    orb1: "bg-sky-300/15",
    orb2: "bg-blue-400/10",
  },
  evening: {
    label: "Good evening",
    icon: Sunset,
    gradient: "from-[#2A1B4D] via-[#5B2A6D] to-[#B8557A]",
    orb1: "bg-rose-400/15",
    orb2: "bg-violet-400/10",
  },
  night: {
    label: "Good night",
    icon: Moon,
    gradient: "from-[#0C0E1F] via-[#1B1F3B] to-[#2E2456]",
    orb1: "bg-indigo-400/10",
    orb2: "bg-violet-500/10",
  },
};

const subscribeNoop = () => () => {};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

interface Highlight {
  icon: typeof Sun;
  label: string;
  href: string;
}

// The handful of things worth acting on right now, most time-sensitive first.
function buildHighlights(data: UserDashboard): Highlight[] {
  const items: Highlight[] = [];
  const birthday = data.upcomingBirthdays[0];
  const event = data.community.upcomingEvents[0];

  if (birthday && birthday.daysAway <= 7) {
    const firstName = birthday.name.split(" ")[0];
    items.push({
      icon: Cake,
      label:
        birthday.daysAway === 0
          ? `It's ${firstName}'s birthday today`
          : `${firstName}'s birthday ${birthdayLabel(birthday.daysAway).toLowerCase()}`,
      href: `/users/${birthday.username ?? birthday.id}`,
    });
  }
  if (data.shopping.awaitingConfirmation > 0) {
    items.push({
      icon: CheckCircle2,
      label: `Confirm ${plural(data.shopping.awaitingConfirmation, "delivery").replace("deliverys", "deliveries")}`,
      href: "/marketplace/orders",
    });
  }
  if (data.inbox.unreadMessages > 0) {
    items.push({ icon: MessageCircle, label: plural(data.inbox.unreadMessages, "unread message"), href: "/messages" });
  }
  if (data.inbox.unreadNotifications > 0) {
    items.push({ icon: Bell, label: plural(data.inbox.unreadNotifications, "new notification"), href: "/notifications" });
  }
  if (data.shopping.activeOrders > 0) {
    items.push({
      icon: Package,
      label: `${plural(data.shopping.activeOrders, "order")} on the way`,
      href: "/marketplace/orders",
    });
  }
  if (event) {
    items.push({ icon: CalendarDays, label: `Upcoming: ${event.title}`, href: `/events/${event.id}` });
  }

  return items.slice(0, 3);
}

export default function HeroCard({ name, data, profileCompletion }: HeroCardProps) {
  // Time-of-day and date depend on the viewer's clock, so they're only read
  // on the client - the server render (and hydration) uses a fixed fallback.
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const timeOfDay: TimeOfDay = isClient ? getTimeOfDay() : "evening";
  const today = isClient
    ? new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })
    : "";

  const theme = themes[timeOfDay];
  const Icon = theme.icon;
  const firstName = name.split(" ")[0];
  const highlights = data ? buildHighlights(data) : [];
  const seller = data?.seller;
  const isActiveSeller = seller?.status === "APPROVED" && seller.hasStore;
  const sellerTag = data ? sellerTagFor(seller ?? null) : null;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-6 text-white shadow-2xl sm:p-10 lg:p-12`}
    >
      <div className={`pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full ${theme.orb1} blur-3xl`} />
      <div className={`pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full ${theme.orb2} blur-3xl`} />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {sellerTag && <SellerTag tag={sellerTag} />}

      {/* Room for the hanging tag: below it on phones, beside it on desktop
          (the reach panel drops down instead). */}
      <div className={`relative z-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center ${sellerTag ? "pt-[5.5rem] sm:pt-16 lg:pt-0" : ""}`}>
        <div className="min-w-0">
          <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-xl">
            <Icon size={15} className="text-white/90" />
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium tracking-wide text-white/90">
              {theme.label.toUpperCase()}
            </span>
            {today && <span className="text-[12px] text-white/60">· {today}</span>}
          </div>

          <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-[38px] italic leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
            Hello, {firstName}
          </h1>

          {data &&
            (highlights.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <li key={item.label} className="max-w-full">
                    <Link
                      href={item.href}
                      className="group inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/20"
                    >
                      <item.icon size={14} className="shrink-0 text-white/80" />
                      <span className="truncate">{item.label}</span>
                      <ArrowRight size={13} className="shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/75">
                You&apos;re all caught up. Share something with your communities or see what&apos;s new.
              </p>
            ))}

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/feed"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-3 sm:h-12 bg-white text-[13.5px] font-semibold sm:px-6 sm:text-[14px] text-[#2A1B4D] shadow-lg transition-colors hover:bg-white/90"
            >
              <PenSquare size={17} />
              Create post
            </Link>
            {isActiveSeller ? (
              <Link
                href="/settings/marketplace"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-3 sm:h-12 border border-white/20 bg-white/10 text-[13.5px] font-semibold sm:px-6 sm:text-[14px] backdrop-blur-xl transition-colors hover:bg-white/[0.18]"
              >
                <Store size={17} />
                Manage store
              </Link>
            ) : (
              <Link
                href="/communities"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-3 sm:h-12 border border-white/20 bg-white/10 text-[13.5px] font-semibold sm:px-6 sm:text-[14px] backdrop-blur-xl transition-colors hover:bg-white/[0.18]"
              >
                <Compass size={17} />
                Explore communities
              </Link>
            )}
          </div>
        </div>

        {data && (
          <div className={sellerTag ? "lg:pt-20" : ""}>
            <ReachPanel data={data} profileCompletion={profileCompletion} />
          </div>
        )}
      </div>
    </section>
  );
}

interface SellerTagContent {
  eyebrow: string;
  label: string;
  href: string;
}

// The swing tag nudges people who don't sell yet. None while an application
// is pending, and none for active sellers.
function sellerTagFor(seller: UserDashboard["seller"]): SellerTagContent | null {
  if (!seller || seller.status === "REJECTED") {
    return { eyebrow: "Sell on Nestly", label: "Become a seller", href: "/marketplace/sell" };
  }
  if (seller.status === "APPROVED" && !seller.hasStore) {
    return { eyebrow: "Almost there", label: "Set up your store", href: "/settings/marketplace?tab=store" };
  }
  return null;
}

// Hangs from the top edge of the hero on a "string" and swings gently.
function SellerTag({ tag }: { tag: SellerTagContent }) {
  return (
    <Link
      href={tag.href}
      aria-label={tag.label}
      className="swing-tag group absolute right-5 top-0 z-20 flex flex-col items-center sm:right-10 lg:right-14"
    >
      {/* the string */}
      <span className="block h-6 w-[2px] rounded-full bg-white/60 sm:h-8" />
      <span className="relative -mt-0.5 block rounded-2xl bg-gradient-to-br from-amber-200 via-amber-300 to-orange-400 px-3 pb-2.5 pt-4 text-center text-[#3B1D00] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/50 transition-transform duration-200 group-hover:scale-105 sm:px-4 sm:pb-3 sm:pt-5">
        {/* the hole the string goes through */}
        <span className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-[#3B1D00]/35 ring-2 ring-white/70 sm:top-2" />
        <Store size={18} className="mx-auto" />
        <span className="mt-1 block font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.18em] opacity-75 sm:text-[10px]">
          {tag.eyebrow}
        </span>
        <span className="mt-0.5 flex items-center justify-center gap-1 whitespace-nowrap text-[12.5px] font-extrabold sm:text-[13.5px]">
          {tag.label}
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}

function ReachPanel({ data, profileCompletion }: { data: UserDashboard; profileCompletion?: number }) {
  const metrics = [
    { label: "New followers", value: data.social.newFollowers },
    { label: "Likes", value: data.social.newLikes },
    { label: "Profile views", value: data.social.profileViews },
  ];
  const trend = data.activity.map((point) => ({ value: point.likes + point.views + point.followers }));
  const hasTrend = trend.some((point) => point.value > 0);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:p-6">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-white/70">
        Your reach · last {data.range.days} days
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-0">
            <p className="font-[family-name:var(--font-mono)] text-[24px] font-semibold leading-none sm:text-[28px]">
              {formatCount(metric.value)}
            </p>
            <p className="mt-1.5 truncate text-[12px] text-white/70">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 h-14">
        {hasTrend ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="heroTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ffffff"
                strokeOpacity={0.85}
                strokeWidth={2}
                fill="url(#heroTrend)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-full items-center text-[12.5px] text-white/60">
            Post, comment and follow people to start growing your reach.
          </p>
        )}
      </div>

      {profileCompletion !== undefined && profileCompletion < 100 && (
        <Link href="/settings/profile" className="group mt-4 block border-t border-white/15 pt-4">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-white/80">Profile {profileCompletion}% complete</span>
            <span className="flex items-center gap-1 font-semibold">
              Finish
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white" style={{ width: `${profileCompletion}%` }} />
          </div>
        </Link>
      )}
    </div>
  );
}
