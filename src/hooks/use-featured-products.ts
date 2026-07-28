"use client";

import { useQuery } from "@tanstack/react-query";

import { getFeaturedProducts } from "../services/product.services";

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => getFeaturedProducts(limit),
    select: (response) => response.data,
  });
};
