"use client";

import { useQuery } from "@tanstack/react-query";

import { getRelatedProducts } from "../services/product.services";

export const useRelatedProducts = (id: string, limit?: number) => {
  return useQuery({
    queryKey: ["products", "related", id, limit],
    queryFn: () => getRelatedProducts(id, limit),
    select: (response) => response.data,
    enabled: !!id,
  });
};
