"use client";

import { useQuery } from "@tanstack/react-query";

import { getBanks } from "../services/store.services";

export const useBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: getBanks,
    select: (response) => response.data,
    staleTime: 24 * 60 * 60 * 1000,
  });
};
