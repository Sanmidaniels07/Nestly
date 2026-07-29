"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerPayouts } from "../services/seller-dashboard.services";

export const useSellerPayouts = (params: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["seller-dashboard", "payouts", params],
    queryFn: () => getSellerPayouts(params),
    select: (response) => response.data,
  });
};
