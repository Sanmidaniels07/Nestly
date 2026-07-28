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
    },
  });
};
