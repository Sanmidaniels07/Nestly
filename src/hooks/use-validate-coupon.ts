"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { validateCoupon } from "../services/coupon.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { ValidateCouponResult } from "../types/coupon";

export const useValidateCoupon = () => {
  return useMutation<
    ApiResponse<ValidateCouponResult>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: validateCoupon,

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Invalid coupon code");
    },
  });
};
