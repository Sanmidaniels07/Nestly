"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerSalesOverview } from "../services/seller-dashboard.services";

export const useSellerSalesOverview = (days?: number) => {
  return useQuery({
    queryKey: ["seller-dashboard", "sales-overview", days],
    queryFn: () => getSellerSalesOverview(days),
    select: (response) => response.data,
  });
};
