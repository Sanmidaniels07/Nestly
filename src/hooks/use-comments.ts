"use client";

import { useQuery } from "@tanstack/react-query";

import { getComments } from "../services/comment.services";

export const useComments = (postId: string, enabled = true) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    select: (response) => response.data,
    enabled,
  });
};
