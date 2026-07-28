"use client";

import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/product.services";
import { ProductListParams } from "../types/product";

export const useProducts = (params: ProductListParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    select: (response) => response.data,
  });
};
