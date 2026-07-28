"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreBySlug } from "../services/store.services";

export const useStore = (slug: string) => {
  return useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    select: (response) => response.data,
    enabled: !!slug,
  });
};
