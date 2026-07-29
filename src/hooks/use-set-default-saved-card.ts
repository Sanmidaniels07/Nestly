"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { setDefaultSavedCard } from "../services/payment-method.services";
import { ApiErrorResponse } from "../types/api";

export const useSetDefaultSavedCard = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: setDefaultSavedCard,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-cards"] });
      toast.success("Default card updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update default card");
    },
  });
};
