"use client";

import { Bell } from "lucide-react";

import { useNotifications } from "@/src/hooks/use-notifications";
import { useMarkNotificationRead } from "@/src/hooks/use-mark-notification-read";
import { formatRelativeTime } from "@/src/lib/date";
import Skeleton from "@/src/components/ui/skeleton";

export default function RecentActivity() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Bell size={16} className="text-violet-600" />
        </div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
          Recent activity
        </h3>
      </div>

      {isLoading && (
        <div className="mt-6 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3.5">
              <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && notifications?.length === 0 && (
        <p className="py-8 text-center text-[13px] text-[#94A3B8]">
          No notifications yet
        </p>
      )}

      {!isLoading && !!notifications?.length && (
        <div className="mt-6 space-y-5">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => !notification.isRead && markRead(notification.id)}
              className="flex w-full gap-3.5 text-left"
            >
              <div className="mt-0.5 shrink-0 text-violet-500">
                <Bell size={17} fill={notification.isRead ? "none" : "currentColor"} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13.5px] leading-snug ${
                    notification.isRead ? "text-[#64748B]" : "font-medium text-[#13131A]"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="mt-1.5 text-[12px] text-[#94A3B8]">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
