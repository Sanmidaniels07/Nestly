"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteCategory } from "../services/category.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete category");
    },
  });
};
