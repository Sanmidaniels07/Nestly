"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { reactToStory } from "../services/story.services";
import { ApiErrorResponse } from "../types/api";

export const useReactToStory = (storyId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (emoji) => reactToStory(storyId, emoji),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["story", storyId] });
    },
  });
};
