"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createCoupon } from "../services/coupon.services";
import { ApiErrorResponse } from "../types/api";
import { CreateCouponPayload } from "../types/coupon";

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateCouponPayload>({
    mutationFn: createCoupon,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon created");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to create coupon");
    },
  });
};
