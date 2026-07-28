"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { addToCart } from "../services/cart.services";
import { ApiErrorResponse } from "../types/api";
import { AddToCartPayload } from "../types/cart";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, AddToCartPayload>({
    mutationFn: addToCart,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to add to cart");
    },
  });
};
