"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../services/notification.services";

export const useNotifications = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select: (response) => response.data,
    enabled: options.enabled,
  });
};
