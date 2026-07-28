"use client";

import { useQuery } from "@tanstack/react-query";

import { getCommunityBySlug } from "../services/community.services";

export const useCommunity = (slug: string) => {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: () => getCommunityBySlug(slug),
    select: (response) => response.data,
    enabled: !!slug,
  });
};
