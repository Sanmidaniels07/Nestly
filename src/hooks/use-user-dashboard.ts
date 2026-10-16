"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getUserDashboard } from "../services/user-dashboard.services";
import { DashboardRange } from "../types/user-dashboard";

export const useUserDashboard = (days: DashboardRange) => {
  return useQuery({
    queryKey: ["user-dashboard", days],
    queryFn: () => getUserDashboard(days),
    select: (response) => response.data,
    // Switching the 7/30/90-day range keeps the current numbers on screen
    // until the new ones arrive, instead of flashing skeletons.
    placeholderData: keepPreviousData,
  });
};
