"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { setSellerVerified } from "../services/admin-seller.services";
import { ApiErrorResponse } from "../types/api";

export const useSetSellerVerified = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; isVerified: boolean }>({
    mutationFn: ({ id, isVerified }) => setSellerVerified(id, isVerified),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      // Store cards/badges elsewhere read the same flag.
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success(variables.isVerified ? "Business marked as verified" : "Verification removed");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update verification");
    },
  });
};
