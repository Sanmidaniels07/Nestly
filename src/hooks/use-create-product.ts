"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createProduct } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";
import { CreateProductPayload } from "../types/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    CreateProductPayload
  >({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
      toast.success("Product saved");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to save product");
    },
  });
};
