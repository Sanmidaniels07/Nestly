"use client";

import { useQuery } from "@tanstack/react-query";

import { quickSearch } from "../services/search.services";

export const useQuickSearch = (q: string) => {
  return useQuery({
    queryKey: ["search", "quick", q],
    queryFn: () => quickSearch(q),
    select: (response) => response.data,
    enabled: q.trim().length > 0,
  });
};
