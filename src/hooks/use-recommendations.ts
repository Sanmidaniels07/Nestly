"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useSession } from "./use-session";
import {
  getBestSellers,
  getForYou,
  getRecentlyViewed,
  getTrendingProducts,
  recordProductView,
} from "../services/recommendation.services";

export const useTrendingProducts = (limit?: number) => {
  return useQuery({
    queryKey: ["recommendations", "trending", limit],
    queryFn: () => getTrendingProducts(limit),
    select: (response) => response.data,
  });
};

export const useBestSellers = (limit?: number, category?: string) => {
  return useQuery({
    queryKey: ["recommendations", "best-sellers", limit, category],
    queryFn: () => getBestSellers(limit, category),
    select: (response) => response.data,
  });
};

// Signed-in users only.
export const useForYou = (limit?: number) => {
  const { isLoggedIn } = useSession();
  return useQuery({
    queryKey: ["recommendations", "for-you", limit],
    queryFn: () => getForYou(limit),
    select: (response) => response.data,
    enabled: isLoggedIn,
  });
};

export const useRecentlyViewed = (limit?: number) => {
  const { isLoggedIn } = useSession();
  return useQuery({
    queryKey: ["recommendations", "recently-viewed", limit],
    queryFn: () => getRecentlyViewed(limit),
    select: (response) => response.data,
    enabled: isLoggedIn,
  });
};

// Tells the backend a signed-in user opened this product (feeds "For you",
// trending and "Recently viewed"). Guests aren't tracked.
export const useRecordProductView = (productId?: string) => {
  const { isLoggedIn } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn || !productId) return;
    recordProductView(productId)
      .then(() => queryClient.invalidateQueries({ queryKey: ["recommendations", "recently-viewed"] }))
      .catch(() => {});
  }, [isLoggedIn, productId, queryClient]);
};
