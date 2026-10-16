"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { settingsNavigation } from "@/src/constants/settings-navigation";

export default function SettingsSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="min-w-0 lg:h-fit lg:rounded-2xl lg:border lg:border-line lg:bg-surface lg:p-3">
      {/* Mobile: horizontal scroll strip */}
      <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden">
        {settingsNavigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-violet-600 text-white"
                  : "border border-line bg-surface text-muted hover:border-violet-200 dark:hover:border-violet-500/30"
              )}
            >
              <item.icon size={15} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Desktop: vertical nav */}
      <nav className="hidden space-y-1 lg:block">
        {settingsNavigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                active ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300" : "text-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
              )}
              <item.icon
                size={17}
                className={active ? "text-violet-600 dark:text-violet-400" : "text-subtle group-hover:text-violet-600 dark:group-hover:text-violet-400"}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}