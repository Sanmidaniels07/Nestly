"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { becomeSeller } from "../services/seller.services";
import { ApiErrorResponse } from "../types/api";
import { BecomeSellerPayload } from "../types/seller";

export const useBecomeSeller = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    BecomeSellerPayload
  >({
    mutationFn: becomeSeller,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "me"] });
      toast.success("You're now a seller");
    },

    onError: (error) => {
      toast.error(
        error.response?.data.message ?? "Failed to activate seller account"
      );

      // A 403 here means the reapply cooldown wasn't actually over (stale
      // countdown, clock skew, or a page left open past the window) —
      // re-fetch so the countdown/button reflects the server's truth.
      if (error.response?.status === 403) {
        queryClient.invalidateQueries({ queryKey: ["seller", "me"] });
      }
    },
  });
};
