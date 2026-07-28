"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { logoutSession } from "../services/session.services";
import { useAuthStore } from "../store/auth-store";

export const useLogout = () => {
  const router = useRouter();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () =>
      refreshToken ? logoutSession(refreshToken) : Promise.resolve(),

    onSettled: () => {
      logout();
      router.push("/login");
    },
  });
};
