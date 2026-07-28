"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteProduct } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
      toast.success("Product archived");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to archive product");
    },
  });
};
