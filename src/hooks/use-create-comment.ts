"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createComment } from "../services/comment.services";
import { ApiErrorResponse } from "../types/api";

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (content) => createComment(postId, content),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to post comment");
    },
  });
};
