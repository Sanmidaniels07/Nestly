"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { useUnreadNotificationsCount } from "@/src/hooks/use-unread-notifications-count";
import { useAuth } from "@/src/hooks/use-auth";

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { count } = useUnreadNotificationsCount({ enabled: isAuthenticated });

  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECE9F6] bg-white transition-colors hover:border-violet-300 hover:bg-[#F8F7FC]"
    >
      <Bell size={19} className="text-[#475569]" />

      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
