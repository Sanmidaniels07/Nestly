"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { removeCartItem } from "../services/cart.services";
import { CartItem } from "../types/cart";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: CartItem[]) =>
      Promise.all(items.map((item) => removeCartItem(item.productId))),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },

    onError: () => {
      toast.error("Failed to clear cart");
    },
  });
};
