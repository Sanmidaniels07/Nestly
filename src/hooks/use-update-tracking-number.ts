"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateOrderTrackingNumber } from "../services/order.services";
import { ApiErrorResponse } from "../types/api";

export const useUpdateTrackingNumber = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; trackingNumber: string }
  >({
    mutationFn: ({ id, trackingNumber }) =>
      updateOrderTrackingNumber(id, trackingNumber),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seller-order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      toast.success("Tracking number updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update tracking number");
    },
  });
};
