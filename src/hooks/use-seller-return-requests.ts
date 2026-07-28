"use client";

import { useQuery } from "@tanstack/react-query";

import { getSellerReturnRequests } from "../services/return-request.services";
import { ReturnRequestListParams } from "../types/return-request";

export const useSellerReturnRequests = (params: ReturnRequestListParams = {}) => {
  return useQuery({
    queryKey: ["returns", "seller", params],
    queryFn: () => getSellerReturnRequests(params),
    select: (response) => response.data,
  });
};
