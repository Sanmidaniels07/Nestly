"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { cancelOrder } from "../services/order.services";
import { ApiErrorResponse } from "../types/api";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: cancelOrder,

    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Order cancelled");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to cancel order");
    },
  });
};
