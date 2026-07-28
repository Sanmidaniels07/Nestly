"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteShippingOption } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteShippingOption = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (optionId) => deleteShippingOption(slug, optionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", slug] });
      toast.success("Shipping option removed");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to remove shipping option");
    },
  });
};
