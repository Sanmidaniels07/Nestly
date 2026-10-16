import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { DashboardRange, UserDashboard } from "../types/user-dashboard";

export const getUserDashboard = async (days: DashboardRange) => {
  const response = await api.get<ApiResponse<UserDashboard>>("/dashboard", {
    params: { days: String(days) },
  });
  return response.data;
};
