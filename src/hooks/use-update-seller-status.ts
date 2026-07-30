"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateSellerStatus } from "../services/admin-seller.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateSellerStatusPayload } from "../types/admin-seller";

export const useUpdateSellerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateSellerStatusPayload }
  >({
    mutationFn: ({ id, data }) => updateSellerStatus(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      toast.success(
        variables.data.status === "APPROVED"
          ? "Seller approved"
          : "Seller rejected"
      );
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update seller status");
    },
  });
};
