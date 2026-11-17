"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getShoppingFeed } from "../services/feed.services";

// The home feed. Creating, editing or deleting a post refreshes it
// (use-create-post / use-update-post / use-delete-post).
export const useShoppingFeed = () =>
  useInfiniteQuery({
    queryKey: ["shopping-feed"],
    queryFn: ({ pageParam }) => getShoppingFeed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.data.nextBefore ?? undefined,
  });
