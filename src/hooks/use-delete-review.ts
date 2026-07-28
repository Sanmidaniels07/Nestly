"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteReview } from "../services/review.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteReview,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      toast.success("Review deleted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete review");
    },
  });
};
