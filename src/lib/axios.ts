import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { refreshSession } from "../services/session.services";
import { useAuthStore } from "../store/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Lets the browser send the httpOnly refresh-token cookie on every
  // request and accept new Set-Cookie headers back (login/refresh/logout).
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshWaiters: ((token: string | null) => void)[] = [];

const resolveWaiters = (token: string | null) => {
  refreshWaiters.forEach((resolve) => resolve(token));
  refreshWaiters = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isSessionRoute = originalRequest?.url?.includes("/session/");

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isSessionRoute
    ) {
      return Promise.reject(error);
    }

    const { setAccessToken, logout } = useAuthStore.getState();

    originalRequest._retry = true;

    // No refresh token to check client-side anymore — it's an httpOnly
    // cookie the browser attaches on its own. If there isn't a valid one,
    // the refresh call below simply 401s and we log out in the catch.
    if (isRefreshing) {
      const token = await new Promise<string | null>((resolve) => {
        refreshWaiters.push(resolve);
      });

      if (!token) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    }

    isRefreshing = true;

    try {
      const { data } = await refreshSession();
      setAccessToken(data.accessToken);
      resolveWaiters(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveWaiters(null);
      logout();

      // Guard against redirecting to where we already are — without this,
      // any unauthenticated request made from the login page itself (e.g. a
      // component that queries a protected endpoint unconditionally) would
      // reject, fail to refresh, and reload the same page forever.
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
