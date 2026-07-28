"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerOrders } from "../services/order.services";
import { OrderListParams } from "../types/order";

export const useSellerOrders = (params: OrderListParams = {}, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["seller-orders", params],
    queryFn: () => getSellerOrders(params),
    select: (response) => response.data,
    enabled: options.enabled,
  });
};
