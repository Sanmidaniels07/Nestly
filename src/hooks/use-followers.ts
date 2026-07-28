"use client";

import { useQuery } from "@tanstack/react-query";

import { getFollowers } from "../services/follow.services";

export const useFollowers = (
  userId: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["followers", userId, params],
    queryFn: () => getFollowers(userId, params),
    select: (response) => response.data,
    enabled: !!userId,
  });
};
