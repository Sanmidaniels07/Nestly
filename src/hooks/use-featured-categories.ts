"use client";

import { useQuery } from "@tanstack/react-query";

import { getFeaturedCategories } from "../services/category.services";

export const useFeaturedCategories = (limit?: number) => {
  return useQuery({
    queryKey: ["categories", "featured", limit],
    queryFn: () => getFeaturedCategories(limit),
    select: (response) => response.data,
  });
};
