"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoriesFeed } from "../services/story.services";

export const useStoriesFeed = () => {
  return useQuery({
    queryKey: ["stories", "feed"],
    queryFn: getStoriesFeed,
    select: (response) => response.data,
  });
};
