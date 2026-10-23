"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminProducts, getProductHistory } from "../services/admin-product.services";
import { AdminProductListParams } from "../types/admin-product";

export const useAdminProducts = (params: AdminProductListParams) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => getAdminProducts(params),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });
};

export const useProductHistory = (id: string | null, page = 1) => {
  return useQuery({
    queryKey: ["admin", "product-history", id, page],
    queryFn: () => getProductHistory(id as string, { page, limit: 20 }),
    select: (response) => response.data,
    enabled: !!id,
  });
};
