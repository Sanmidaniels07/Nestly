"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { settingsNavigation } from "@/src/constants/settings-navigation";

export default function SettingsSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="lg:h-fit lg:rounded-2xl lg:border lg:border-[#ECE9F6] lg:bg-white lg:p-3">
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
                  : "border border-[#ECE9F6] bg-white text-[#64748B] hover:border-violet-200"
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
                active ? "bg-violet-50 text-violet-700" : "text-[#64748B] hover:bg-[#F7F7FB] hover:text-[#13131A]"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
              )}
              <item.icon
                size={17}
                className={active ? "text-violet-600" : "text-[#94A3B8] group-hover:text-violet-600"}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}