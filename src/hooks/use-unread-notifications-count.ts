"use client";

import { useNotifications } from "./use-notifications";

export const useUnreadNotificationsCount = (options?: { enabled?: boolean }) => {
  const { data: notifications, isLoading } = useNotifications(options);
  const count = notifications?.filter((notification) => !notification.isRead).length ?? 0;

  return { count, isLoading };
};
