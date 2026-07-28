"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addToWishlist, removeFromWishlist } from "../services/wishlist.services";
import { useWishlist } from "./use-wishlist";

export const useToggleWishlist = (productId: string) => {
  const queryClient = useQueryClient();
  const { data: wishlist } = useWishlist();

  const isSaved = !!wishlist?.some((item) => item.productId === productId);

  const toggle = useMutation<unknown, unknown, void>({
    mutationFn: () =>
      isSaved ? removeFromWishlist(productId) : addToWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(isSaved ? "Removed from saved" : "Saved");
    },

    onError: () => {
      toast.error("Failed to update saved items");
    },
  });

  return {
    isSaved,
    toggle: () => toggle.mutate(),
    isToggling: toggle.isPending,
  };
};
