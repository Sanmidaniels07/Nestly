import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { AdminOverview, OverviewRange } from "../types/admin-overview";

export const getAdminOverview = async (days: OverviewRange) => {
  const response = await api.get<ApiResponse<AdminOverview>>("/admin/overview", {
    params: { days },
  });
  return response.data;
};
