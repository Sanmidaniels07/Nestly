"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addToWishlist, removeFromWishlist } from "../services/wishlist.services";
import { useWishlist } from "./use-wishlist";
import { useRequireLogin, useSession } from "./use-session";

export const useToggleWishlist = (productId: string) => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useSession();
  const requireLogin = useRequireLogin();
  const { data: wishlist } = useWishlist({ enabled: isLoggedIn });

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
    toggle: () => {
      if (requireLogin("Log in to save items you like.")) toggle.mutate();
    },
    isToggling: toggle.isPending,
  };
};
