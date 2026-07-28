"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerRecentOrders } from "../services/seller-dashboard.services";

export const useSellerRecentOrders = (limit?: number) => {
  return useQuery({
    queryKey: ["seller-dashboard", "recent-orders", limit],
    queryFn: () => getSellerRecentOrders(limit),
    select: (response) => response.data,
  });
};
