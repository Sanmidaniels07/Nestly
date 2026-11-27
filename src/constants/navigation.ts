import {
  ShoppingBag,
  Newspaper,
  Package,
  MessageCircle,
  CircleUserRound,
  ShieldAlert,
  BriefcaseBusiness,
  Users2,
  CalendarDays,
} from "lucide-react";

// Where people land after logging in (and where the installed app opens):
// the feed, the first item in the side menu. Everything personal (profile,
// settings, notifications, birthdays) lives under Me.
export const APP_HOME = "/feed";

export interface NavItem {
  title: string;
  href: string;
  icon: typeof ShoppingBag;
  // Shown in the phone's bottom bar (the rest are reached from Me).
  mobile?: boolean;
  sellerOnly?: boolean;
  adminOnly?: boolean;
  // Hidden while that feature is switched off (lib/features).
  feature?: "communities" | "events";
}

export const navigation: NavItem[] = [
  // Feed comes first in the side menu. On phones it's a tab at the top of
  // Shop instead (no bottom-bar item).
  { title: "Feed", href: "/feed", icon: Newspaper },
  { title: "Shop", href: "/marketplace", icon: ShoppingBag, mobile: true },
  { title: "Orders", href: "/marketplace/orders", icon: Package, mobile: true },
  { title: "Messages", href: "/messages", icon: MessageCircle, mobile: true },
  // The sellers' workspace (dashboard, products, orders, earnings). Lives
  // under /settings/marketplace; only shown to applicants and sellers.
  { title: "Seller Hub", href: "/settings/marketplace", icon: BriefcaseBusiness, sellerOnly: true, mobile: true },
  { title: "Communities", href: "/communities", icon: Users2, feature: "communities" },
  { title: "Events", href: "/events", icon: CalendarDays, feature: "events" },
  { title: "Me", href: "/me", icon: CircleUserRound, mobile: true },
  { title: "Admin", href: "/admin", icon: ShieldAlert, adminOnly: true },
];
