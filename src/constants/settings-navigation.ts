import {
  User,
  Shield,
  Lock,
  Bell,
  Palette,
  BriefcaseBusiness,
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
    title: "Security",
    href: "/settings/security",
    icon: Lock,
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
    title: "Seller Hub",
    href: "/settings/marketplace",
    icon: BriefcaseBusiness,
  },
];