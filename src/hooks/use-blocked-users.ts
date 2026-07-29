"use client";

import { useQuery } from "@tanstack/react-query";

import { getBlockedUsers } from "../services/block.services";

export const useBlockedUsers = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["blocked-users", params],
    queryFn: () => getBlockedUsers(params),
    select: (response) => response.data,
  });
};
