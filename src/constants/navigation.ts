import {
  LayoutDashboard,
  Newspaper,
  Users,
  UserRoundCheck,
  Store,
  Bell,
  User,
  Settings,
  Users2,
  CalendarDays,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Feed",
    href: "/feed",
    icon: Newspaper,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
  {
    title: "Followers",
    href: "/followers",
    icon: Users,
  },
  {
    title: "Following",
    href: "/following",
    icon: UserRoundCheck,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: Store,
  },
  {
    title: "Communities",
    href: "/communities",
    icon: Users2,
  },
  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: ShieldAlert,
    adminOnly: true,
  },
];