"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { isNavActive, useVisibleNavigation } from "@/src/hooks/use-visible-navigation";
import { cn } from "@/src/lib/utils";

// The phone's bottom bar: Shop, Orders, Messages, (Seller Hub,) Me. Four or
// five fixed places, no "More" - everything else is one tap away in Me.
export default function MobileNav() {
  const pathname = usePathname();
  const items = useVisibleNavigation().filter((item) => item.mobile);

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-surface/90 backdrop-blur-2xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-1.5 pt-1.5">
        {items.map((item) => {
          // Phones have no Feed button: the feed is a tab on Shop, so Shop lights up there.
          const active = isNavActive(item.href, pathname) || (item.href === "/marketplace" && (pathname === "/feed" || pathname.startsWith("/feed/")));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition-transform active:scale-95"
            >
              <span className="relative flex h-8 w-14 items-center justify-center">
                {active && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 rounded-full bg-violet-100 dark:bg-violet-500/20"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <item.icon
                  size={21}
                  strokeWidth={active ? 2.3 : 1.9}
                  className={cn("relative", active ? "text-violet-700 dark:text-violet-300" : "text-muted")}
                />
              </span>
              <span className={cn("truncate text-[11px]", active ? "font-semibold text-violet-700 dark:text-violet-300" : "font-medium text-muted")}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
