"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductReviews } from "../services/product.services";

export const useProductReviews = (
  id: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["product-reviews", id, params],
    queryFn: () => getProductReviews(id, params),
    select: (response) => response.data,
    enabled: !!id,
  });
};
