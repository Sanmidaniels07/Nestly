"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminOverview } from "../services/admin-overview.services";
import { OverviewRange } from "../types/admin-overview";

export const useAdminOverview = (days: OverviewRange) => {
  return useQuery({
    queryKey: ["admin", "overview", days],
    queryFn: () => getAdminOverview(days),
    select: (response) => response.data,
    // Keep the current numbers on screen while another range loads.
    placeholderData: keepPreviousData,
  });
};
