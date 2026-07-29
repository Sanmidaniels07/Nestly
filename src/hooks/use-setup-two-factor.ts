"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { setupTwoFactor } from "../services/twofactor.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { TwoFactorSetupData } from "../types/auth";

export const useSetupTwoFactor = () => {
  return useMutation<
    ApiResponse<TwoFactorSetupData>,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: setupTwoFactor,

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to start setup");
    },
  });
};
