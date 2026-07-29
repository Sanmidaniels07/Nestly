"use client";

import { useQuery } from "@tanstack/react-query";

import { searchByType } from "../services/search.services";
import { SearchByTypeParams, SearchResultType } from "../types/search";

export const useSearchByType = <T extends SearchResultType>(
  type: T,
  params: SearchByTypeParams
) => {
  return useQuery({
    queryKey: ["search", type, params],
    queryFn: () => searchByType(type, params),
    select: (response) => response.data,
    enabled: params.q.trim().length > 0,
  });
};
