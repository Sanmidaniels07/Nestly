"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { bulkDeleteProducts } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";
import { BulkDeleteProductsPayload } from "../types/product";

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    BulkDeleteProductsPayload
  >({
    mutationFn: bulkDeleteProducts,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
      toast.success("Products archived");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to archive products");
    },
  });
};
