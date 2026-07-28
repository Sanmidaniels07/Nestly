"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createPost } from "../services/post.services";
import { ApiErrorResponse } from "../types/api";
import { CreatePostPayload } from "../types/post";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreatePostPayload>({
    mutationFn: createPost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post published");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to publish post");
    },
  });
};
