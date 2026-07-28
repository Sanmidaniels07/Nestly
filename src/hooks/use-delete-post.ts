"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deletePost } from "../services/post.services";
import { ApiErrorResponse } from "../types/api";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete post");
    },
  });
};
