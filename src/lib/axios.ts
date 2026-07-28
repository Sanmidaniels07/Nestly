import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { refreshSession } from "../services/session.services";
import { useAuthStore } from "../store/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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
      const { data } = await refreshSession(refreshToken);
      setTokens(data.accessToken, data.refreshToken);
      resolveWaiters(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveWaiters(null);
      logout();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
