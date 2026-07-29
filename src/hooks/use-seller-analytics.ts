"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerAnalytics } from "../services/seller-dashboard.services";

export const useSellerAnalytics = () => {
  return useQuery({
    queryKey: ["seller-dashboard", "analytics"],
    queryFn: getSellerAnalytics,
    select: (response) => response.data,
  });
};
