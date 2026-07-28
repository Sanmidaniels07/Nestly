"use client";

import { useQuery } from "@tanstack/react-query";

import { getFollowStatus } from "../services/follow.services";

export const useFollowStatus = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ["follow-status", userId],
    queryFn: () => getFollowStatus(userId),
    select: (response) => response.data.isFollowing,
    enabled: enabled && !!userId,
  });
};
