"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { verifyCheckout } from "../services/checkout.services";
import { ApiErrorResponse } from "../types/api";

export const useVerifyCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: verifyCheckout,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to verify payment");
    },
  });
};
