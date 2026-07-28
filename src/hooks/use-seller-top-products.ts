"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerTopProducts } from "../services/seller-dashboard.services";

export const useSellerTopProducts = (limit?: number) => {
  return useQuery({
    queryKey: ["seller-dashboard", "top-products", limit],
    queryFn: () => getSellerTopProducts(limit),
    select: (response) => response.data,
  });
};
