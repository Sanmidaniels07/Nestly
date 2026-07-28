"use client";

import { useQuery } from "@tanstack/react-query";

import { getPostsByHashtag } from "../services/hashtag.services";

export const usePostsByHashtag = (
  tag: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["hashtag-posts", tag, params],
    queryFn: () => getPostsByHashtag(tag, params),
    select: (response) => response.data,
    enabled: !!tag,
  });
};
