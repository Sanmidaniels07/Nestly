"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminSellers } from "../services/admin-seller.services";
import { AdminSellerListParams } from "../types/admin-seller";

export const useAdminSellers = (params: AdminSellerListParams) => {
  return useQuery({
    queryKey: ["admin", "sellers", params],
    queryFn: () => getAdminSellers(params),
    select: (response) => response.data,
  });
};
