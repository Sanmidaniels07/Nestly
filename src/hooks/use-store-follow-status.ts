"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreFollowStatus } from "../services/store.services";

export const useStoreFollowStatus = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ["store-follow-status", slug],
    queryFn: () => getStoreFollowStatus(slug),
    select: (response) => response.data.isFollowing,
    enabled: enabled && !!slug,
  });
};
