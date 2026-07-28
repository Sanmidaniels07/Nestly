"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateProduct } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateProductPayload } from "../types/product";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateProductPayload }
  >({
    mutationFn: ({ id, data }) => updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
      toast.success("Product updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update product");
    },
  });
};
