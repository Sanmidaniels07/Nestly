"use client";

import { useQuery } from "@tanstack/react-query";

import { getStores } from "../services/store.services";
import { StoreListParams } from "../types/store";

export const useStores = (params: StoreListParams = {}) => {
  return useQuery({
    queryKey: ["stores", params],
    queryFn: () => getStores(params),
    select: (response) => response.data,
  });
};
