import {
  User,
  Shield,
  Bell,
  Palette,
  Store,
} from "lucide-react";

export const settingsNavigation = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: Shield,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "Marketplace",
    href: "/settings/marketplace",
    icon: Store,
  },
];