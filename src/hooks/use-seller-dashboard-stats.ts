"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerDashboardStats } from "../services/seller-dashboard.services";

export const useSellerDashboardStats = () => {
  return useQuery({
    queryKey: ["seller-dashboard", "stats"],
    queryFn: getSellerDashboardStats,
    select: (response) => response.data,
  });
};
