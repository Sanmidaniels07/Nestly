"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateNotificationPreference } from "../services/notification.services";
import { ApiErrorResponse } from "../types/api";
import { NotificationPreferenceType } from "../types/notification";

export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { type: NotificationPreferenceType; enabled: boolean }
  >({
    mutationFn: ({ type, enabled }) => updateNotificationPreference(type, enabled),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update preference");
    },
  });
};
