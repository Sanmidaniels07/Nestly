"use client";

import { useQuery } from "@tanstack/react-query";

import { getTrendingCommunities } from "../services/community.services";

export const useTrendingCommunities = (limit?: number) => {
  return useQuery({
    queryKey: ["communities", "trending", limit],
    queryFn: () => getTrendingCommunities(limit),
    select: (response) => response.data,
  });
};
