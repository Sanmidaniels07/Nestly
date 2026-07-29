"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateCategory } from "../services/category.services";
import { ApiErrorResponse } from "../types/api";
import { UpdateCategoryPayload } from "../types/category";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateCategoryPayload }
  >({
    mutationFn: ({ id, data }) => updateCategory(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update category");
    },
  });
};
