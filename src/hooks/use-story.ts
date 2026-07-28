"use client";

import { useQuery } from "@tanstack/react-query";

import { getStory } from "../services/story.services";

export const useStory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["story", id],
    queryFn: () => getStory(id),
    select: (response) => response.data,
    enabled: enabled && !!id,
  });
};
