"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { likePost, unlikePost } from "../services/like.services";

// Posts from GET /api/posts and GET /api/posts/:id already carry `likeCount`
// and `likedByMe`, so feed rendering never needs to call GET /likes/:postId
// per post. This hook just seeds local state from those fields and handles
// the toggle mutation optimistically.
export const usePostLikes = (
  postId: string,
  initial: { count: number; likedByMe: boolean }
) => {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(initial.count);
  const [isLiked, setIsLiked] = useState(initial.likedByMe);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["posts"] });

  const like = useMutation<unknown, AxiosError, void>({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      setIsLiked(true);
      setCount((prev) => prev + 1);
      invalidate();
    },
    onError: (error) => {
      // Already liked from a previous session — just sync local state.
      if (error.response?.status === 400) setIsLiked(true);
    },
  });

  const unlike = useMutation<unknown, AxiosError, void>({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      setIsLiked(false);
      setCount((prev) => Math.max(0, prev - 1));
      invalidate();
    },
    onError: (error) => {
      // Wasn't liked to begin with — just sync local state.
      if (error.response?.status === 404) setIsLiked(false);
    },
  });

  return {
    count,
    isLiked,
    toggleLike: () => (isLiked ? unlike.mutate() : like.mutate()),
    isToggling: like.isPending || unlike.isPending,
  };
};
