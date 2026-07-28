"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteComment } from "../services/comment.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete comment");
    },
  });
};
