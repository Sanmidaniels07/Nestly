"use client";

import { useQuery } from "@tanstack/react-query";

import { getReports } from "../services/report.services";
import { ReportListParams } from "../types/report";

export const useReports = (params: ReportListParams = {}) => {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
    select: (response) => response.data,
  });
};
