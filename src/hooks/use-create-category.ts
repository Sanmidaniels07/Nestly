"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createCategory } from "../services/category.services";
import { ApiErrorResponse } from "../types/api";
import { CreateCategoryPayload } from "../types/category";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateCategoryPayload>({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to create category");
    },
  });
};
