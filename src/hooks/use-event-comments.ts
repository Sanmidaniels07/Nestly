"use client";

import { useQuery } from "@tanstack/react-query";

import { getEventComments } from "../services/event.services";

export const useEventComments = (
  id: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["event-comments", id, params],
    queryFn: () => getEventComments(id, params),
    select: (response) => response.data,
    enabled: !!id,
  });
};
