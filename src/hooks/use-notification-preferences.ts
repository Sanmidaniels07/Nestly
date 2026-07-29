"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotificationPreferences } from "../services/notification.services";

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ["notification-preferences"],
    queryFn: getNotificationPreferences,
    select: (response) => response.data,
  });
};
