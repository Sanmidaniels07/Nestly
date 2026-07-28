"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createStory } from "../services/story.services";
import { ApiErrorResponse } from "../types/api";
import { CreateStoryPayload } from "../types/story";

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateStoryPayload>({
    mutationFn: createStory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "feed"] });
      toast.success("Story posted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to post story");
    },
  });
};
