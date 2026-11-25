"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Newspaper, ShoppingBag } from "lucide-react";

import { cn } from "@/src/lib/utils";

const TABS = [
  { href: "/marketplace", label: "Shop", icon: ShoppingBag },
  { href: "/feed", label: "Feed", icon: Newspaper },
];

// Shop | Feed at the top of the home screen: one place to browse, with what
// friends buy and stores you follow one tap away.
export default function ShopTabs({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <div role="tablist" aria-label="Home" className={cn("inline-flex rounded-full border border-line bg-surface p-1 shadow-sm", className)}>
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={active}
            className={cn(
              "relative flex h-9 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold transition-colors",
              active ? "text-white" : "text-muted hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="shop-tabs-active"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_6px_16px_-6px_rgba(91,33,182,0.6)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon size={15} className="relative" />
            <span className="relative">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
