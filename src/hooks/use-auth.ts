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

  const isHydrated = useAuthStore(
    (state) => state.isHydrated
  );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  return {
    user,
    accessToken,
    logout,

    // False until the one-time silent-refresh bootstrap has resolved —
    // check this before branching UI on isAuthenticated, or you'll flash
    // the signed-out state for a moment on every hard refresh.
    isHydrated,

    isAuthenticated:
      !!user && !!accessToken,

    isVerified:
      !!user?.isVerified,
  };
};
