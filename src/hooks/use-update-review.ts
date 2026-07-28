"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateReview } from "../services/review.services";
import { ApiErrorResponse } from "../types/api";

export const useUpdateReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; rating?: number; comment?: string }
  >({
    mutationFn: ({ id, ...data }) => updateReview(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      toast.success("Review updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update review");
    },
  });
};
