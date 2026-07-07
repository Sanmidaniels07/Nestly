"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/src/constants/navigation";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/auth-store";

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className="
        fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-[264px]
        flex-col border-r border-[#ECE9F6] bg-white/80 backdrop-blur-2xl lg:flex
      "
    >
      {/* Navigation */}
      <nav className="hover-scroll flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors",
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-[#64748B] hover:bg-[#F7F7FB] hover:text-[#13131A]"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
              )}

              <item.icon
                size={19}
                className={active ? "text-violet-600" : "text-[#94A3B8] group-hover:text-violet-600"}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="border-t border-[#F2F1F8] p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl border border-[#ECE9F6] bg-white p-3 transition-colors hover:border-violet-200 hover:bg-[#FBFAFE]"
        >
          <div className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-violet-700">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13.5px] font-semibold text-[#13131A]">
              {user?.name}
            </h3>
            <p className="truncate font-[family-name:var(--font-mono)] text-[11.5px] text-[#94A3B8]">
              {user?.email}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}