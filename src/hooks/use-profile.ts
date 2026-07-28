"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../services/profile.services";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: getProfile,
    select: (response) => response.data,
  });
};
