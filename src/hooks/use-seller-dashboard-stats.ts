"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerDashboardStats } from "../services/seller-dashboard.services";

export const useSellerDashboardStats = (enabled = true) => {
  return useQuery({
    queryKey: ["seller-dashboard", "stats"],
    queryFn: getSellerDashboardStats,
    select: (response) => response.data,
    enabled,
  });
};
