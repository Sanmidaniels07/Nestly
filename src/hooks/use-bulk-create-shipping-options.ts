"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { bulkCreateShippingOptions } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";
import { CreateShippingOptionPayload } from "../types/store";

export const useBulkCreateShippingOptions = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateShippingOptionPayload[]>({
    mutationFn: (options) => bulkCreateShippingOptions(slug, options),

    onSuccess: (_result, options) => {
      queryClient.invalidateQueries({ queryKey: ["store", slug] });
      queryClient.invalidateQueries({ queryKey: ["store", "me"] });
      toast.success(`${options.length} shipping zone${options.length === 1 ? "" : "s"} added`);
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to add shipping zones");
    },
  });
};
