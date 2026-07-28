"use client";

import { useQuery } from "@tanstack/react-query";

import { getCart } from "../services/cart.services";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    select: (response) => response.data.items,
  });
};
