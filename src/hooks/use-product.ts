"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../services/product.services";

type ProductResponse = Awaited<ReturnType<typeof getProductById>>;

// initialData: the response the server already fetched for a public page.
export const useProduct = (id: string, initialData?: ProductResponse) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    select: (response) => response.data,
    enabled: !!id,
    initialData,
  });
};
