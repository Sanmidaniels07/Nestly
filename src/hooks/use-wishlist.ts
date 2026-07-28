"use client";

import { useQuery } from "@tanstack/react-query";

import { getWishlist } from "../services/wishlist.services";

export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist({ limit: 100 }),
    select: (response) => response.data.items,
  });
};
