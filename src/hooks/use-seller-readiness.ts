"use client";

import { useQuery } from "@tanstack/react-query";

import { getMySellerReadiness } from "../services/seller.services";

// What an approved seller still has to do before buyers can order.
export const useSellerReadiness = (enabled = true) => {
  return useQuery({
    queryKey: ["seller", "me", "readiness"],
    queryFn: getMySellerReadiness,
    select: (response) => response.data,
    enabled,
  });
};
