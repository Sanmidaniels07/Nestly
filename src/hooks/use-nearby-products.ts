"use client";

import { useQuery } from "@tanstack/react-query";

import { getNearbyProducts } from "../services/product.services";
import { NearbyProductParams } from "../types/product";

export const useNearbyProducts = (params: NearbyProductParams) => {
  return useQuery({
    queryKey: ["products", "nearby", params],
    queryFn: () => getNearbyProducts(params),
    select: (response) => response.data,
    enabled: !!(params.city || params.state),
  });
};
