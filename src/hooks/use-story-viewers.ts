"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoryViewers } from "../services/story.services";

export const useStoryViewers = (
  id: string,
  params: { page?: number; limit?: number } = {},
  enabled = true
) => {
  return useQuery({
    queryKey: ["story-viewers", id, params],
    queryFn: () => getStoryViewers(id, params),
    select: (response) => response.data,
    enabled: enabled && !!id,
  });
};
