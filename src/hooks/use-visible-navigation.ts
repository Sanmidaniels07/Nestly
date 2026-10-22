"use client";

import { navigation } from "../constants/navigation";
import { useAuthStore } from "../store/auth-store";
import { useMySeller } from "./use-my-seller";

/**
 * Side-nav items for the current user: Admin only for admins, Seller Hub only
 * for people who've applied to sell or been approved (pending or approved,
 * with or without a store yet). Rejected applicants and shoppers use the
 * "Become a seller" route instead.
 */
export function useVisibleNavigation() {
  const user = useAuthStore((state) => state.user);
  const { data: seller } = useMySeller();
  const isSeller = !!seller && seller.status !== "REJECTED";

  return navigation.filter((item) => {
    if (item.adminOnly && user?.role !== "ADMIN") return false;
    if ("sellerOnly" in item && item.sellerOnly && !isSeller) return false;
    return true;
  });
}

/**
 * Is `href` the active nav item for `pathname`? Seller Hub lives under
 * /settings, so Settings must not also light up while you're in it.
 */
export function isNavActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === href;
  if (href === "/settings" && pathname.startsWith("/settings/marketplace")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
