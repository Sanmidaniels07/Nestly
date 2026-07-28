"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { verifyStore } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";

export const useVerifyStore = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; isVerified: boolean }
  >({
    mutationFn: ({ id, isVerified }) => verifyStore(id, isVerified),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", slug] });
      toast.success("Store verification updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update verification");
    },
  });
};
