"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { removeFollower } from "../services/follow.services";
import { ApiErrorResponse } from "../types/api";

// Remove someone from your followers (they aren't told).
export const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: removeFollower,
    onSuccess: () => {
      // Follower counts on your profile and dashboard.
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Couldn't remove this follower");
    },
  });
};
