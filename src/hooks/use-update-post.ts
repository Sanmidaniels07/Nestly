"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { updatePost } from "../services/post.services";
import { ApiErrorResponse } from "../types/api";
import { UpdatePostPayload } from "../types/post";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdatePostPayload }
  >({
    mutationFn: ({ id, data }) => updatePost(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to update post");
    },
  });
};
