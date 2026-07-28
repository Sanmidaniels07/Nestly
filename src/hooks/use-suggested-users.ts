"use client";

import { useQuery } from "@tanstack/react-query";

import { getSuggestedUsers } from "../services/user.services";

export const useSuggestedUsers = (limit?: number) => {
  return useQuery({
    queryKey: ["users", "suggested", limit],
    queryFn: () => getSuggestedUsers(limit),
    select: (response) => response.data,
  });
};
