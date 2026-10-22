"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isNavActive, useVisibleNavigation } from "@/src/hooks/use-visible-navigation";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/auth-store";
import { useUnreadNotificationsCount } from "@/src/hooks/use-unread-notifications-count";
import SettingsPopover from "./settings-popover";
import LogoutConfirmDialog from "@/src/components/ui/logout-confirm-dialog";
import { MessageCircle } from "lucide-react";
import { supportWhatsAppUrl } from "@/src/lib/support";

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const { count: unreadNotifications } = useUnreadNotificationsCount();

  const isActive = (href: string) => isNavActive(href, pathname);
  // Settings stays unhighlighted inside Seller Hub (/settings/marketplace).
  const inSettings = isNavActive("/settings", pathname);

  const visibleNavigation = useVisibleNavigation();

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-[264px] flex-col border-r border-line bg-surface/80 backdrop-blur-2xl lg:flex">
      <nav className="hover-scroll flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {visibleNavigation.map((item) => {
          const active = isActive(item.href);
          const isSettings = item.href === "/settings";

          if (isSettings) {
            return (
              <div key={item.href} className="relative">
                <button
                  ref={settingsButtonRef}
                  onClick={() => setSettingsOpen((prev) => !prev)}
                  aria-expanded={settingsOpen}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors",
                    settingsOpen || inSettings
                      ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "text-muted hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  {(settingsOpen || inSettings) && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
                  )}
                  <item.icon
                    size={19}
                    className={
                      settingsOpen || inSettings
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-subtle group-hover:text-violet-600 dark:group-hover:text-violet-400"
                    }
                  />
                  <span>{item.title}</span>
                </button>

                {settingsOpen && (
                  <SettingsPopover
                    email={user?.email}
                    onClose={() => setSettingsOpen(false)}
                    onLogoutClick={() => setLogoutConfirmOpen(true)}
                    anchorRef={settingsButtonRef}
                  />
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors",
                active
                  ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
              )}
              <item.icon
                size={19}
                className={active ? "text-violet-600 dark:text-violet-400" : "text-subtle group-hover:text-violet-600 dark:group-hover:text-violet-400"}
              />
              <span className="flex-1">{item.title}</span>
              {item.href === "/notifications" && unreadNotifications > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-1 text-[10px] font-bold text-white">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-line-soft p-4">
        <a
          href={supportWhatsAppUrl("Hi Nestly Support, I need help with ")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366]">
            <MessageCircle size={15} />
          </span>
          <span className="flex-1">Help &amp; support</span>
          <span className="text-[11px] text-subtle">WhatsApp</span>
        </a>

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:bg-surface-sunken"
        >
          <div className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-[14px] font-semibold text-violet-700 dark:text-violet-300">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13.5px] font-semibold text-ink">
              {user?.name}
            </h3>
            <p className="truncate font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
              {user?.email}
            </p>
          </div>
        </Link>

        <p className="px-1 pt-1 text-[11px] leading-relaxed text-subtle">
          <Link href="/terms" className="hover:text-violet-600 dark:hover:text-violet-400">Terms</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-violet-600 dark:hover:text-violet-400">Privacy</Link>
          {" · "}
          <Link href="/seller-terms" className="hover:text-violet-600 dark:hover:text-violet-400">Seller Agreement</Link>
        </p>
      </div>

      <LogoutConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
      />
    </aside>
  );
}
