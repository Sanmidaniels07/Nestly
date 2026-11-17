"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerOpenOrders } from "../services/admin-seller.services";

// Admin, before rejecting a seller: their open orders and money held.
export const useSellerOpenOrders = (sellerId: string, enabled: boolean) =>
  useQuery({
    queryKey: ["admin", "seller-open-orders", sellerId],
    queryFn: () => getSellerOpenOrders(sellerId),
    select: (response) => response.data,
    enabled,
  });
