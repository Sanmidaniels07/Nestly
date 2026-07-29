"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { replyToReview } from "../services/review.services";
import { ApiErrorResponse } from "../types/api";

export const useReplyToReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; reply: string }
  >({
    mutationFn: ({ id, reply }) => replyToReview(id, reply),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-reviews"] });
      toast.success("Reply posted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to post reply");
    },
  });
};
