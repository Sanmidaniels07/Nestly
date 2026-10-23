"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { login } from "../services/auth.services";
import { useAuthStore } from "../store/auth-store";
import { getSafeReturnTo, rememberReturnTo, rememberedReturnTo } from "../lib/return-to";
import { useEffect } from "react";
import {
  ApiErrorResponse,
  AuthResponse,
  LoginPayload,
} from "../types/auth";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  // Keep it in case they tap "Create one" and sign up first.
  useEffect(() => {
    if (returnTo) rememberReturnTo(returnTo);
  }, [returnTo]);

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    LoginPayload
  >({
    mutationFn: login,

    onSuccess: (response) => {
      if ("requires2FA" in response.data) {
        return;
      }

      const {
        accessToken,
        user,
      } = response.data;

      setAuth(
        user,
        accessToken
      );

      toast.success(
        "Logged in successfully"
      );

      if (!user.isVerified) {
        router.push(
          `/verify-email/sent?email=${encodeURIComponent(
            user.email
          )}`
        );
        return;
      }

      router.push(returnTo ?? rememberedReturnTo() ?? "/dashboard");
    },

    onError: (error) => {
      toast.error(
        error.response?.data.message ??
          "Login failed"
      );
    },
  });
};