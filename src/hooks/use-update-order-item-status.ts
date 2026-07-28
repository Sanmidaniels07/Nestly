"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateOrderItemStatus } from "../services/order.services";
import { ApiErrorResponse } from "../types/api";

export const useUpdateOrderItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { orderItemId: string; status: string }
  >({
    mutationFn: ({ orderItemId, status }) => updateOrderItemStatus(orderItemId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      toast.success("Order status updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update status");
    },
  });
};
