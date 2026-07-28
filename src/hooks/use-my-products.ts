"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProducts } from "../services/product.services";
import { MyProductParams } from "../types/product";

export const useMyProducts = (params: MyProductParams = {}, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["products", "me", params],
    queryFn: () => getMyProducts(params),
    select: (response) => response.data,
    enabled: options.enabled,
  });
};
