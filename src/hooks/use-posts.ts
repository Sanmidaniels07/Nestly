"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getPosts } from "../services/post.services";
import { PostListParams } from "../types/post";

const PAGE_LIMIT = 10;

export const usePosts = (
  params: Omit<PostListParams, "page" | "limit"> = {},
  options: { enabled?: boolean } = {}
) => {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam }) =>
      getPosts({ ...params, page: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: options.enabled,
  });
};
