"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getMySeller } from "../services/seller.services";
import { ApiErrorResponse } from "../types/api";

export const useMySeller = () => {
  return useQuery({
    queryKey: ["seller", "me"],
    queryFn: getMySeller,
    select: (response) => response.data,
    retry: (failureCount, error) => {
      const status = (error as AxiosError<ApiErrorResponse>).response?.status;
      if (status === 404) return false;
      return failureCount < 1;
    },
  });
};
