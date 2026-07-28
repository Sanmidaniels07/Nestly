"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { removeCartItem } from "../services/cart.services";
import { ApiErrorResponse } from "../types/api";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: removeCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to remove item");
    },
  });
};
