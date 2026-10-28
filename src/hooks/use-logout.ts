"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { logoutSession } from "../services/session.services";
import { useAuthStore } from "../store/auth-store";
import { disablePush } from "../lib/push";

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      // While still signed in: stop this device getting their notifications.
      await disablePush().catch(() => {});
      return logoutSession();
    },

    onSettled: () => {
      logout();
      router.push("/login");
    },
  });
};
