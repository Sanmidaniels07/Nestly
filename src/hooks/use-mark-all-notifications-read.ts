"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { markAllNotificationsRead } from "../services/notification.services";
import { ApiErrorResponse } from "../types/api";

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: markAllNotificationsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to mark all as read");
    },
  });
};
