"use client";

import { useAuthStore } from "../store/auth-store";

export const useAuth = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  const accessToken =
    useAuthStore(
      (state) => state.accessToken
    );

  const refreshToken =
    useAuthStore(
      (state) => state.refreshToken
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  return {
    user,
    accessToken,
    refreshToken,
    logout,

    isAuthenticated:
      !!user && !!accessToken,

    isVerified:
      !!user?.isVerified,
  };
};