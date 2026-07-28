import axios from "axios";

import { ApiResponse } from "../types/api";

interface RefreshResult {
  accessToken: string;
}

// Uses a bare axios call (not the shared `api` instance) so a refresh never
// recurses through the response interceptor that triggers it. The refresh
// token itself is never read or sent explicitly — it lives in an httpOnly
// cookie that the browser attaches automatically because of withCredentials.
export const refreshSession = async (): Promise<ApiResponse<RefreshResult>> => {
  const response = await axios.post<ApiResponse<RefreshResult>>(
    `${process.env.NEXT_PUBLIC_API_URL}/session/refresh`,
    {},
    { withCredentials: true }
  );

  return response.data;
};

export const logoutSession = async () => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/session/logout`,
    {},
    { withCredentials: true }
  );

  return response.data;
};
