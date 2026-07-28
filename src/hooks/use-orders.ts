"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrders } from "../services/order.services";
import { OrderListParams } from "../types/order";

export const useOrders = (params: OrderListParams = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    select: (response) => response.data,
  });
};
