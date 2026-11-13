"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { recheckSellerCac } from "../services/admin-seller.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { AdminSeller } from "../types/admin-seller";
import { CAC_RESULT_LABEL } from "../lib/cac";

// Admin: run the automatic CAC lookup again (e.g. after it failed).
export const useRecheckSellerCac = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AdminSeller>, AxiosError<ApiErrorResponse>, string>({
    mutationFn: recheckSellerCac,

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      const result = response.data?.cacCheckResult;
      toast.success(result ? `CAC check: ${CAC_RESULT_LABEL[result]}` : "CAC number checked");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Couldn't run the CAC check");
    },
  });
};
