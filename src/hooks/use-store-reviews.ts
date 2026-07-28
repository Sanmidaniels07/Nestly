"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreReviews } from "../services/store.services";

export const useStoreReviews = (
  slug: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["store-reviews", slug, params],
    queryFn: () => getStoreReviews(slug, params),
    select: (response) => response.data,
    enabled: !!slug,
  });
};
