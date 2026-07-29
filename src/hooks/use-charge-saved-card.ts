"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { chargeSavedCard } from "../services/checkout.services";
import { ApiErrorResponse } from "../types/api";
import { ChargeSavedCardPayload } from "../types/checkout";

export const useChargeSavedCard = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, ChargeSavedCardPayload>({
    mutationFn: chargeSavedCard,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Payment failed");
    },
  });
};
