"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreTrust } from "../services/store.services";
import { ApiResponse } from "../types/api";
import { StoreTrust } from "../types/trust";

// A store's public trust record. The API caches it for 10 minutes, so a
// stale-time to match avoids refetching on every visit.
export const useStoreTrust = (slug: string | undefined, initial?: ApiResponse<StoreTrust>) =>
  useQuery({
    queryKey: ["store", "trust", slug],
    queryFn: () => getStoreTrust(slug!),
    select: (response) => response.data,
    enabled: !!slug,
    initialData: initial,
    staleTime: 10 * 60 * 1000,
  });
