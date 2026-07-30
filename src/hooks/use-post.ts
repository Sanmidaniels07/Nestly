"use client";

import { useQuery } from "@tanstack/react-query";

import { getPost } from "../services/post.services";

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    select: (response) => response.data,
    enabled: !!id,
    retry: false,
  });
};
