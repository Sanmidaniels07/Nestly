"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "../services/user.services";

export const useUserProfile = (identifier: string) => {
  return useQuery({
    queryKey: ["user", identifier],
    queryFn: () => getUserProfile(identifier),
    select: (response) => response.data,
    enabled: !!identifier,
  });
};
