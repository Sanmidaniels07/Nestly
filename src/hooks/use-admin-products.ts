"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getAdminProducts, getProductHistory, setProductFeatured } from "../services/admin-product.services";
import { AdminProductListParams } from "../types/admin-product";

export const useAdminProducts = (params: AdminProductListParams) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => getAdminProducts(params),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
  });
};

export const useProductHistory = (id: string | null, page = 1) => {
  return useQuery({
    queryKey: ["admin", "product-history", id, page],
    queryFn: () => getProductHistory(id as string, { page, limit: 20 }),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useSetProductFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => setProductFeatured(id, isFeatured),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "featured"] });
      toast.success(response.message);
    },
    onError: () => toast.error("Couldn't update - please try again"),
  });
};
