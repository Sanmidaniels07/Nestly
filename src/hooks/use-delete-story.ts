"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteStory } from "../services/story.services";
import { ApiErrorResponse } from "../types/api";

export const useDeleteStory = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteStory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "feed"] });
      toast.success("Story deleted");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete story");
    },
  });
};
