"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerEarnings } from "../services/seller-dashboard.services";

export const useSellerEarnings = () => {
  return useQuery({
    queryKey: ["seller-dashboard", "earnings"],
    queryFn: getSellerEarnings,
    select: (response) => response.data,
  });
};
