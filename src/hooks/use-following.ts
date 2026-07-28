"use client";

import { useQuery } from "@tanstack/react-query";

import { getFollowing } from "../services/follow.services";

export const useFollowing = (
  userId: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["following", userId, params],
    queryFn: () => getFollowing(userId, params),
    select: (response) => response.data,
    enabled: !!userId,
  });
};
