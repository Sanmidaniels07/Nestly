"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/src/hooks/use-cart";
import { useAuth } from "@/src/hooks/use-auth";
import { guestCartCount, useGuestCart } from "@/src/store/guest-cart-store";

const noop = () => () => {};

// The browser-kept cart only exists after hydration (avoids a server /
// client mismatch on the count).
export const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

export default function CartButton({ guest = false }: { guest?: boolean }) {
  const { isAuthenticated } = useAuth();
  const { data: items } = useCart({ enabled: isAuthenticated && !guest });
  const guestLines = useGuestCart((state) => state.lines);
  const isClient = useIsClient();
  // Shopping without an account: the cart kept in this browser.
  const totalItems = guest
    ? isClient
      ? guestCartCount(guestLines)
      : 0
    : items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <Link
      href={guest ? "/cart" : "/marketplace/cart"}
      aria-label={totalItems > 0 ? `Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}` : "Cart"}
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface transition-colors hover:border-violet-300 dark:hover:border-violet-500/40 hover:bg-surface-sunken"
    >
      <ShoppingCart size={19} className="text-ink-3" />

      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-1 text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

/** Signed out: the cart icon shows once something is in the browser cart. */
export function GuestCartButton() {
  const count = useGuestCart((state) => guestCartCount(state.lines));
  const isClient = useIsClient();
  if (!isClient || count === 0) return null;
  return <CartButton guest />;
}
