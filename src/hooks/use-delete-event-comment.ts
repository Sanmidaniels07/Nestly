"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteEventComment } from "../services/event.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteEventComment = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteEventComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-comments", eventId] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete comment");
    },
  });
};
