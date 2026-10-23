"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreProducts } from "../services/store.services";

type StoreProductsResponse = Awaited<ReturnType<typeof getStoreProducts>>;

export const useStoreProducts = (
  slug: string,
  params: { page?: number; limit?: number } = {},
  initialData?: StoreProductsResponse
) => {
  return useQuery({
    queryKey: ["store-products", slug, params],
    queryFn: () => getStoreProducts(slug, params),
    select: (response) => response.data,
    enabled: !!slug,
    initialData,
  });
};
