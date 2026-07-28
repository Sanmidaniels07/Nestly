"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { followStore, unfollowStore } from "../services/store.services";
import { ApiErrorResponse } from "../types/api";

export const useToggleStoreFollow = (slug: string, initialIsFollowing: boolean) => {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["store-follow-status", slug] });
    queryClient.invalidateQueries({ queryKey: ["store", slug] });
  };

  const follow = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => followStore(slug),
    onSuccess: () => {
      setIsFollowing(true);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to follow store");
    },
  });

  const unfollow = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => unfollowStore(slug),
    onSuccess: () => {
      setIsFollowing(false);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to unfollow store");
    },
  });

  return {
    isFollowing,
    toggleFollow: () => (isFollowing ? unfollow.mutate() : follow.mutate()),
    isToggling: follow.isPending || unfollow.isPending,
  };
};
