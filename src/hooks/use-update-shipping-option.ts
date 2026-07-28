"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateShippingOption } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateShippingOptionPayload } from "../types/store";

export const useUpdateShippingOption = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { optionId: string; data: UpdateShippingOptionPayload }
  >({
    mutationFn: ({ optionId, data }) => updateShippingOption(slug, optionId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", slug] });
      toast.success("Shipping option updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update shipping option");
    },
  });
};
