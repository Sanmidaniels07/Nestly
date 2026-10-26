"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyReferralStats } from "../services/referral.services";

// The seller's share-link code and what their links have brought in.
export const useMyReferrals = (enabled = true) => {
  return useQuery({
    queryKey: ["referrals", "me"],
    queryFn: getMyReferralStats,
    select: (response) => response.data,
    enabled,
  });
};
