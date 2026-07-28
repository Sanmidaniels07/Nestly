"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerInventory } from "../services/seller-dashboard.services";

export const useSellerInventory = (threshold?: number) => {
  return useQuery({
    queryKey: ["seller-dashboard", "inventory", threshold],
    queryFn: () => getSellerInventory(threshold),
    select: (response) => response.data,
  });
};
