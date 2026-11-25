"use client";

import { navigation } from "../constants/navigation";
import { featureOn } from "../lib/features";
import { useAuthStore } from "../store/auth-store";
import { useMySeller } from "./use-my-seller";

/**
 * Nav items for the current user: Admin only for admins, Seller Hub only
 * for people who've applied to sell or been approved (pending or approved,
 * with or without a store yet). Rejected applicants and shoppers use the
 * "Start selling" row in Me instead.
 */
export function useVisibleNavigation() {
  const user = useAuthStore((state) => state.user);
  const { data: seller } = useMySeller();
  const isSeller = !!seller && seller.status !== "REJECTED";

  return navigation.filter((item) => {
    if (item.feature && !featureOn[item.feature]) return false;
    if (item.adminOnly && user?.role !== "ADMIN") return false;
    if (item.sellerOnly && !isSeller) return false;
    return true;
  });
}

// Your own pages: they light up Me although their address isn't /me.
const ME_PAGES = ["/me", "/profile", "/settings", "/notifications", "/marketplace/saved", "/marketplace/gifts", "/marketplace/returns"];

const pathOf = (href: string) => href.split("?")[0];
const matches = (href: string, pathname: string) => {
  const path = pathOf(href);
  return pathname === path || pathname.startsWith(`${path}/`);
};

/**
 * Is `href` the active nav item for `pathname`? The most specific item wins:
 * /marketplace/orders lights Orders (not Shop), Seller Hub (under /settings)
 * doesn't light Me, and Me covers profile, settings and your other pages.
 */
export function isNavActive(href: string, pathname: string) {
  const best = navigation
    .map((item) => pathOf(item.href))
    .filter((path) => matches(path, pathname))
    .sort((a, b) => b.length - a.length)[0];
  // A specific section (Orders, Messages, Seller Hub...).
  if (best && best !== "/marketplace") return best === pathOf(href);
  const isMePage = ME_PAGES.some((page) => matches(page, pathname));
  if (href === "/me") return isMePage;
  return !isMePage && best === href;
}
