"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyCommunities } from "../services/community.services";

export const useMyCommunities = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["communities", "me", params],
    queryFn: () => getMyCommunities(params),
    select: (response) => response.data,
  });
};
