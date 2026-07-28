"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updateComment } from "../services/comment.services";
import { ApiErrorResponse } from "../types/api";

export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; content: string }
  >({
    mutationFn: ({ id, content }) => updateComment(id, content),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update comment");
    },
  });
};
