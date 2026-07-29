"use client";

import { useQuery } from "@tanstack/react-query";

import { getStoreTraffic } from "../services/seller-dashboard.services";

export const useStoreTraffic = (days?: number) => {
  return useQuery({
    queryKey: ["seller-dashboard", "traffic", days],
    queryFn: () => getStoreTraffic(days),
    select: (response) => response.data,
  });
};
