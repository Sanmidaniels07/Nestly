"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerCustomers } from "../services/seller-dashboard.services";

export const useSellerCustomers = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["seller-dashboard", "customers", params],
    queryFn: () => getSellerCustomers(params),
    select: (response) => response.data,
  });
};
