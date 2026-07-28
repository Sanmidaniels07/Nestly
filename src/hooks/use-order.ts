"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrder } from "../services/order.services";

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
