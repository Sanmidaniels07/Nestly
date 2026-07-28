"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateCoupon } from "../services/coupon.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateCouponPayload } from "../types/coupon";

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateCouponPayload }
  >({
    mutationFn: ({ id, data }) => updateCoupon(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update coupon");
    },
  });
};
