"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { removeStoryReaction } from "../services/story.services";
import { ApiErrorResponse } from "../types/api";

export const useRemoveStoryReaction = (storyId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => removeStoryReaction(storyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
    },
  });
};
