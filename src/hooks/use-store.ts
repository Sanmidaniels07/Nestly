"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreBySlug } from "../services/store.services";

type StoreResponse = Awaited<ReturnType<typeof getStoreBySlug>>;

// initialData: the response the server already fetched for a public page.
export const useStore = (slug: string, initialData?: StoreResponse) => {
  return useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    select: (response) => response.data,
    enabled: !!slug,
    initialData,
  });
};
