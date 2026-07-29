"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteSavedCard } from "../services/payment-method.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteSavedCard = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteSavedCard,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-cards"] });
      toast.success("Card removed");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to remove card");
    },
  });
};
