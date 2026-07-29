"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginWithTwoFactor } from "../services/auth.services";
import { useAuthStore } from "../store/auth-store";
import {
  ApiErrorResponse,
  AuthResponse,
  TwoFactorLoginPayload,
} from "../types/auth";

export const useLoginWithTwoFactor = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    TwoFactorLoginPayload
  >({
    mutationFn: loginWithTwoFactor,

    onSuccess: (response) => {
      if ("requires2FA" in response.data) return;

      const { accessToken, user } = response.data;
      setAuth(user, accessToken);

      toast.success("Logged in successfully");

      if (!user.isVerified) {
        router.push(
          `/verify-email/sent?email=${encodeURIComponent(user.email)}`
        );
        return;
      }

      router.push("/dashboard");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Invalid code");
    },
  });
};
