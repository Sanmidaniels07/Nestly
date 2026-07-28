"use client";

import { Bell } from "lucide-react";

import { useNotifications } from "@/src/hooks/use-notifications";
import { useMarkNotificationRead } from "@/src/hooks/use-mark-notification-read";
import { formatRelativeTime } from "@/src/lib/date";

export default function RecentActivity() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  return (
    <div className="bg-white rounded-2xl p-8 border border-[#EDEBF5]">
      <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>

      {isLoading && (
        <p className="text-center text-sm text-gray-400 py-6">Loading...</p>
      )}

      {!isLoading && notifications?.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-6">
          No notifications yet
        </p>
      )}

      <div className="space-y-6">
        {notifications?.map((notification) => (
          <button
            key={notification.id}
            onClick={() => !notification.isRead && markRead(notification.id)}
            className="flex w-full gap-4 text-left"
          >
            <div className="mt-0.5 text-violet-500">
              <Bell size={20} fill={notification.isRead ? "none" : "currentColor"} />
            </div>
            <div className="flex-1">
              <p
                className={`leading-snug ${
                  notification.isRead ? "text-gray-500" : "text-gray-900 font-medium"
                }`}
              >
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1.5">
                {formatRelativeTime(notification.createdAt)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
