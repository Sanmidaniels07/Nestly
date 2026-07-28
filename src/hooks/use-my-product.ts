"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProduct } from "../services/product.services";

export const useMyProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", "me", id],
    queryFn: () => getMyProduct(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
