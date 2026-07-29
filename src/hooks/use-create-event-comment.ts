"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createEventComment } from "../services/event.services";
import { ApiErrorResponse } from "../types/api";

export const useCreateEventComment = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (content) => createEventComment(eventId, content),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-comments", eventId] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to post comment");
    },
  });
};
