"use client";

import { useQuery } from "@tanstack/react-query";

import { getPayouts } from "../services/payout.services";
import { PayoutListParams } from "../types/payout";

export const usePayouts = (params: PayoutListParams) => {
  return useQuery({
    queryKey: ["admin", "payouts", params],
    queryFn: () => getPayouts(params),
    select: (response) => response.data,
  });
};
