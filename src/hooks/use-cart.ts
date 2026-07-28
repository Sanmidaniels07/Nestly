"use client";

import { useQuery } from "@tanstack/react-query";

import { getCart } from "../services/cart.services";

export const useCart = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    select: (response) => response.data.items,
    enabled: options.enabled,
  });
};
