"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from "@/src/hooks/use-auth";
import { addToCart } from "@/src/services/cart.services";
import { useGuestCart } from "@/src/store/guest-cart-store";

// Someone filled a cart without an account, then logged in or signed up:
// those items move into their account cart, so nothing they picked is lost.
export default function GuestCartSync() {
  const { isAuthenticated, isHydrated } = useAuth();
  const queryClient = useQueryClient();
  const running = useRef(false);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || running.current) return;
    const { lines, clear } = useGuestCart.getState();
    if (lines.length === 0) return;
    running.current = true;

    (async () => {
      let moved = 0;
      for (const line of lines) {
        try {
          await addToCart({ productId: line.productId, variationId: line.variationId ?? undefined, quantity: line.quantity });
          moved += line.quantity;
        } catch {
          // Sold out or removed since - left out.
        }
      }
      clear();
      running.current = false;
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (moved > 0) toast.success(`We added ${moved} item${moved === 1 ? "" : "s"} you picked earlier to your cart.`);
    })();
  }, [isAuthenticated, isHydrated, queryClient]);

  return null;
}
