"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorePayoutInfo } from "../services/payout.services";

export const useStorePayoutInfo = (storeId: string | undefined) => {
  return useQuery({
    queryKey: ["admin", "store-payout-info", storeId],
    queryFn: () => getStorePayoutInfo(storeId as string),
    select: (response) => response.data,
    enabled: !!storeId,
  });
};
