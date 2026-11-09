"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getUserWishlist, getWishlist, updateWishlistVisibility } from "../services/wishlist.services";
import { WishlistVisibility } from "../types/wishlist";

export const useWishlist = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist({ limit: 100 }),
    select: (response) => response.data.items,
    enabled: options.enabled,
  });
};

// Same request as useWishlist - who can see it comes back with the items.
export const useWishlistVisibility = () =>
  useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist({ limit: 100 }),
    select: (response) => response.data.visibility,
  });

const SAVED_MESSAGE: Record<WishlistVisibility, string> = {
  PRIVATE: "Your wishlist is private",
  FOLLOWERS: "Your followers can now see your wishlist",
  EVERYONE: "Anyone can now see your wishlist",
};

export const useUpdateWishlistVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWishlistVisibility,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(SAVED_MESSAGE[response.data.wishlistVisibility]);
    },
    onError: () => toast.error("Couldn't change who sees your wishlist"),
  });
};

export const useUserWishlist = (identifier: string, enabled: boolean) =>
  useQuery({
    queryKey: ["wishlist", "user", identifier],
    queryFn: () => getUserWishlist(identifier),
    select: (response) => response.data,
    enabled,
  });
