"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../services/product.services";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
