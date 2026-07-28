"use client";

import { useQuery } from "@tanstack/react-query";

import { getCommunities } from "../services/community.services";
import { CommunityListParams } from "../types/community";

export const useCommunities = (params: CommunityListParams = {}) => {
  return useQuery({
    queryKey: ["communities", params],
    queryFn: () => getCommunities(params),
    select: (response) => response.data,
  });
};
