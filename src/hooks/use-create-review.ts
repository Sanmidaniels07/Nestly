"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createReview } from "../services/review.services";
import { ApiErrorResponse } from "../types/api";
import { CreateReviewPayload } from "../types/review";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateReviewPayload>({
    mutationFn: createReview,

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      toast.success("Review submitted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to submit review");
    },
  });
};
