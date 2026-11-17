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
    Awaited<ReturnType<typeof updateSellerStatus>>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateSellerStatusPayload }
  >({
    mutationFn: ({ id, data }) => updateSellerStatus(id, data),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "seller-open-orders", variables.id] });
      const refunds = response.data.refunds;
      if (variables.data.status === "APPROVED") {
        toast.success("Seller approved");
      } else if (refunds) {
        const extra = refunds.failed + refunds.manual;
        toast.success(
          `Seller rejected. ${refunds.refunded} order${refunds.refunded === 1 ? "" : "s"} refunded${
            extra ? ` - ${extra} need${extra === 1 ? "s" : ""} a manual refund (see notifications)` : ""
          }.`,
          { duration: 7000 }
        );
      } else {
        toast.success("Seller rejected");
      }
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update seller status");
    },
  });
};
