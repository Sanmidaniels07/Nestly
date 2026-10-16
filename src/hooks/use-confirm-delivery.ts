"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { confirmDelivery } from "../services/order.services";
import { ApiErrorResponse } from "../types/api";

export const useConfirmDelivery = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: confirmDelivery,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      toast.success("Thanks! Delivery confirmed");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Couldn't confirm delivery");
    },
  });
};
