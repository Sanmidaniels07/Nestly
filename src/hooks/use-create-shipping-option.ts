"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createShippingOption } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";
import { CreateShippingOptionPayload } from "../types/store";

export const useCreateShippingOption = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateShippingOptionPayload>({
    mutationFn: (data) => createShippingOption(slug, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", slug] });
      toast.success("Shipping option added");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to add shipping option");
    },
  });
};
