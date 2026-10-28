"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerMap } from "../services/seller-dashboard.services";

export const useCustomerMap = (days?: number) => {
  return useQuery({
    queryKey: ["seller-dashboard", "customer-map", days],
    queryFn: () => getCustomerMap(days),
    select: (response) => response.data,
  });
};
