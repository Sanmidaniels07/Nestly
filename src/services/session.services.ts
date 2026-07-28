import axios from "axios";

import { ApiResponse } from "../types/api";

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

// Uses a bare axios call (not the shared `api` instance) so a refresh never
// recurses through the response interceptor that triggers it.
export const refreshSession = async (
  refreshToken: string
): Promise<ApiResponse<RefreshResult>> => {
  const response = await axios.post<ApiResponse<RefreshResult>>(
    `${process.env.NEXT_PUBLIC_API_URL}/session/refresh`,
    { refreshToken }
  );

  return response.data;
};

export const logoutSession = async (refreshToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/session/logout`,
    { refreshToken }
  );

  return response.data;
};
