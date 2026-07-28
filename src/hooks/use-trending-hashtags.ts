"use client";

import { useQuery } from "@tanstack/react-query";

import { getTrendingHashtags } from "../services/hashtag.services";

export const useTrendingHashtags = (limit?: number, days?: number) => {
  return useQuery({
    queryKey: ["hashtags", "trending", limit, days],
    queryFn: () => getTrendingHashtags(limit, days),
    select: (response) => response.data,
  });
};
