"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Gift,
  Heart,
  KeyRound,
  LogOut,
  MapPin,
  Package,
  Palette,
  RotateCcw,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Store,
  UserRound,
} from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { useProfile } from "@/src/hooks/use-profile";
import { useMySeller } from "@/src/hooks/use-my-seller";
import { useUserDashboard } from "@/src/hooks/use-user-dashboard";
import { useUnreadNotificationsCount } from "@/src/hooks/use-unread-notifications-count";
import { supportWhatsAppUrl } from "@/src/lib/support";
import UserAvatar from "@/src/components/ui/user-avatar";
import ThemeToggle from "@/src/components/ui/theme-toggle";
import LogoutConfirmDialog from "@/src/components/ui/logout-confirm-dialog";
import { WhatsAppIcon } from "@/src/components/ui/social-icons";
import PushPrompt from "@/src/components/push/push-prompt";
import ProfileChecklist from "../dashboard/profile-checklist";
import UpcomingCard from "../dashboard/upcoming-card";
import { formatCount } from "../dashboard/format";

// Me: everything personal in one place - your orders at a glance, what needs
// you, then profile, settings, selling and help as a simple list.
export default function MePage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const { data: seller } = useMySeller();
  const { data: dashboard } = useUserDashboard(30);
  const { count: unread } = useUnreadNotificationsCount();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const shopping = dashboard?.shopping;
  const isSeller = !!seller && seller.status !== "REJECTED";
  const name = profile?.name ?? user?.name ?? "";

  const tiles = [
    { href: "/marketplace/orders", icon: Package, label: "Orders", value: shopping ? `${formatCount(shopping.activeOrders)} active` : "" },
    { href: "/marketplace/cart", icon: ShoppingCart, label: "Cart", value: shopping ? `${formatCount(shopping.cartItems)} items` : "" },
    { href: "/marketplace/saved", icon: Heart, label: "Saved", value: shopping ? `${formatCount(shopping.wishlistCount)} items` : "" },
    { href: "/marketplace/gifts", icon: Gift, label: "Gifts", value: "Sent & received" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-24 pt-4 sm:pt-6">
      {/* Who you are */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px]">
            <div className="rounded-full bg-surface p-[2px]">
              <UserAvatar name={name} src={profile?.avatar} size={60} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-[family-name:var(--font-fraunces)] text-[24px] leading-tight text-ink">{name}</h1>
            <p className="truncate text-[13px] text-muted">{profile?.username ? `@${profile.username}` : user?.email}</p>
          </div>
          <Link
            href="/profile"
            className="flex h-10 shrink-0 items-center rounded-xl border border-line px-3.5 text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
          >
            View profile
          </Link>
        </div>
      </motion.section>

      {/* The one thing that needs you, if anything. */}
      {!!shopping?.awaitingConfirmation && (
        <Link
          href="/marketplace/orders"
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100/70 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <KeyRound size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-ink">
              {shopping.awaitingConfirmation === 1 ? "An order is waiting for you" : `${shopping.awaitingConfirmation} orders are waiting for you`}
            </span>
            <span className="block text-[12.5px] text-muted">Got it? Confirm it so the seller is paid.</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-muted" />
        </Link>
      )}

      {/* Your shopping at a glance */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map(({ href, icon: Icon, label, value }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_28px_-18px_rgba(91,33,182,0.45)] active:scale-[0.98] dark:hover:border-violet-500/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400">
              <Icon size={19} />
            </span>
            <p className="mt-3 text-[14px] font-semibold text-ink">{label}</p>
            <p className="truncate text-[12px] text-muted">{value || " "}</p>
          </Link>
        ))}
      </div>

      {profile?.setupSteps && (
        <Suspense fallback={null}>
          <ProfileChecklist steps={profile.setupSteps} />
        </Suspense>
      )}

      <PushPrompt />

      {dashboard && <UpcomingCard birthdays={dashboard.upcomingBirthdays} community={dashboard.community} />}

      <MenuGroup title="Shopping">
        <MenuRow href="/marketplace/returns" icon={RotateCcw} label="Returns & refunds" />
        <MenuRow href="/settings/profile#addresses" icon={MapPin} label="Delivery addresses" />
      </MenuGroup>

      <MenuGroup title="Selling">
        {isSeller ? (
          <MenuRow href="/settings/marketplace" icon={BriefcaseBusiness} label="Seller Hub" hint="Products, orders, earnings" />
        ) : (
          <MenuRow href="/marketplace/sell" icon={Store} label="Start selling on Nestly" hint="Open your shop in minutes" accent />
        )}
      </MenuGroup>

      <MenuGroup title="Account">
        <MenuRow href="/profile" icon={UserRound} label="Profile" />
        <MenuRow href="/notifications" icon={Bell} label="Notifications" badge={unread} />
        <MenuRow href="/settings/profile" icon={Settings} label="Settings" hint="Account, security, privacy" />
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
            <Palette size={17} />
          </span>
          <span className="flex-1 text-[14px] font-medium text-ink">Light or dark</span>
          <ThemeToggle />
        </div>
        {user?.role === "ADMIN" && <MenuRow href="/admin" icon={ShieldAlert} label="Admin" />}
      </MenuGroup>

      <MenuGroup title="Help">
        <a
          href={supportWhatsAppUrl("Hi Nestly Support, I need help with ")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
            <WhatsAppIcon size={17} className="text-emerald-600 dark:text-emerald-400" />
          </span>
          <span className="flex-1 text-[14px] font-medium text-ink">Chat with Nestly Support</span>
          <ChevronRight size={17} className="text-subtle" />
        </a>
        <MenuRow href="/guides" icon={BookOpen} label="Guides" hint="How buying and selling work" />
      </MenuGroup>

      <button
        type="button"
        onClick={() => setConfirmLogout(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3.5 text-[14px] font-semibold text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 dark:text-red-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
      >
        <LogOut size={17} /> Log out
      </button>

      <p className="text-center text-[11.5px] text-subtle">
        <Link href="/terms" className="hover:text-ink">Terms</Link> · <Link href="/privacy" className="hover:text-ink">Privacy</Link> ·{" "}
        <Link href="/seller-terms" className="hover:text-ink">Seller Agreement</Link>
      </p>

      <LogoutConfirmDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </div>
  );
}

function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-[11.5px] font-semibold uppercase tracking-wide text-subtle">{title}</h2>
      <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line bg-surface">{children}</div>
    </section>
  );
}

function MenuRow({
  href,
  icon: Icon,
  label,
  hint,
  badge,
  accent,
}: {
  href: string;
  icon: typeof Bell;
  label: string;
  hint?: string;
  badge?: number;
  accent?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2 active:bg-surface-2">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          accent ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white" : "bg-surface-2 text-muted"
        }`}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {hint && <span className="block truncate text-[12px] text-muted">{hint}</span>}
      </span>
      {!!badge && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10.5px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      <ChevronRight size={17} className="shrink-0 text-subtle" />
    </Link>
  );
}
