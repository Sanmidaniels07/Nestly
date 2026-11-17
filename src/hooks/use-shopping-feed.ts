"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { getFeedArea, getFeedAreaOptions, getShoppingFeed, setFeedArea } from "../services/feed.services";
import { ApiErrorResponse } from "../types/api";

// The home feed ("For you", or "Near me"). Creating, editing or deleting a
// post refreshes both (use-create-post / use-update-post / use-delete-post).
export const useShoppingFeed = (near = false) =>
  useInfiniteQuery({
    queryKey: ["shopping-feed", near ? "near" : "for-you"],
    queryFn: ({ pageParam }) => getShoppingFeed(pageParam, near),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.data.nextBefore ?? undefined,
  });

export const useFeedArea = () =>
  useQuery({ queryKey: ["feed-area"], queryFn: getFeedArea, select: (response) => response.data });

export const useFeedAreaOptions = (state: string) =>
  useQuery({
    queryKey: ["feed-area-options", state],
    queryFn: () => getFeedAreaOptions(state),
    select: (response) => response.data.areas,
    enabled: !!state,
    staleTime: Infinity,
  });

export const useSetFeedArea = () => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof setFeedArea>>, AxiosError<ApiErrorResponse>, { state: string; area?: string | null }>({
    mutationFn: setFeedArea,
    onSuccess: (response) => {
      queryClient.setQueryData(["feed-area"], response);
      queryClient.invalidateQueries({ queryKey: ["shopping-feed", "near"] });
      toast.success(`Showing what's near ${response.data.label}`);
    },
    onError: (error) => toast.error(error.response?.data.message ?? "Couldn't save your area"),
  });
};
