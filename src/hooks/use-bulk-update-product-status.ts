"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { bulkUpdateProductStatus } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";
import { BulkUpdateProductStatusPayload } from "../types/product";

export const useBulkUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    BulkUpdateProductStatusPayload
  >({
    mutationFn: bulkUpdateProductStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
      toast.success("Products updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update products");
    },
  });
};
