"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateCartItem } from "../services/cart.services";
import { ApiErrorResponse } from "../types/api";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { productId: string; quantity: number }
  >({
    mutationFn: ({ productId, quantity }) => updateCartItem(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update quantity");
    },
  });
};
