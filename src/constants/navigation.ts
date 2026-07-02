import {
  LayoutDashboard,
  Newspaper,
  Users,
  UserRoundCheck,
  Store,
  Bell,
  User,
  Settings,
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
];