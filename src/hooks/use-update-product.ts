"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateProduct } from "../services/product.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateProductPayload } from "../types/product";
import { relistTime } from "../lib/product-cooldown";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateProductPayload }
  >({
    mutationFn: ({ id, data }) => updateProduct(id, data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
      const saved = (response as { data?: { status?: string; relistAt?: string | null } } | undefined)?.data;
      if (saved?.status === "UPDATING") {
        const at = relistTime(saved.relistAt);
        toast.success(`Saved. Buyers will see it again ${at ? `at ${at}` : "in a few minutes"}.`, { duration: 6000 });
      } else toast.success("Product updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update product");
    },
  });
};
