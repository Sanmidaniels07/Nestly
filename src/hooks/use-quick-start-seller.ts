"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { quickStartSeller } from "../services/seller.services";
import { ApiErrorResponse } from "../types/api";
import { QuickStartSellerPayload } from "../types/seller";

// Quick start: approved and with a store in one call. The wizard keeps
// going (bank, first link), so it shows its own errors - no toast here.
export const useQuickStartSeller = () => {
  const queryClient = useQueryClient();

  return useMutation<Awaited<ReturnType<typeof quickStartSeller>>, AxiosError<ApiErrorResponse>, QuickStartSellerPayload>({
    mutationFn: quickStartSeller,
    onSuccess: (response) => {
      queryClient.setQueryData(["seller", "me"], response);
      queryClient.invalidateQueries({ queryKey: ["store"] });
      queryClient.invalidateQueries({ queryKey: ["seller"] });
    },
  });
};
