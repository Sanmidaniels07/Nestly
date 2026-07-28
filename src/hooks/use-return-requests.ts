"use client";

import { useQuery } from "@tanstack/react-query";

import { getReturnRequests } from "../services/return-request.services";
import { ReturnRequestListParams } from "../types/return-request";

export const useReturnRequests = (params: ReturnRequestListParams = {}) => {
  return useQuery({
    queryKey: ["returns", params],
    queryFn: () => getReturnRequests(params),
    select: (response) => response.data,
  });
};
