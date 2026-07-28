"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { followUser, unfollowUser } from "../services/follow.services";
import { ApiErrorResponse } from "../types/api";

// Callers pass the known initial follow state (from a list that already
// implies it — e.g. "suggested" always means not-yet-followed, "following"
// always means followed — or from a prior useFollowStatus call when it's
// genuinely unknown, like someone else's followers list).
export const useToggleFollow = (userId: string, initialIsFollowing: boolean) => {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["follow-status", userId] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["followers"] });
    queryClient.invalidateQueries({ queryKey: ["following"] });
  };

  const follow = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      setIsFollowing(true);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to follow");
    },
  });

  const unfollow = useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => {
      setIsFollowing(false);
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to unfollow");
    },
  });

  return {
    isFollowing,
    toggleFollow: () => (isFollowing ? unfollow.mutate() : follow.mutate()),
    isToggling: follow.isPending || unfollow.isPending,
  };
};
