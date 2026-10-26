"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateMySeller } from "../services/seller.services";
import { ApiErrorResponse } from "../types/api";
import { BecomeSellerPayload } from "../types/seller";

// Add, change or remove the seller's CAC number.
export const useUpdateMySeller = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, BecomeSellerPayload>({
    mutationFn: updateMySeller,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "me"] });
      toast.success(variables.cacNumber ? "CAC number saved - we'll check it shortly" : "CAC number removed");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Couldn't save your CAC number");
    },
  });
};
