"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { login } from "../services/auth.services";
import { useAuthStore } from "../store/auth-store";
import {
  ApiErrorResponse,
  AuthResponse,
  LoginPayload,
} from "../types/auth";

export const useLogin = () => {
  const router = useRouter();

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
      const {
        accessToken,
        refreshToken,
        user,
      } = response.data;

      setAuth(
        user,
        accessToken,
        refreshToken
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

      router.push("/dashboard");
    },

    onError: (error) => {
      toast.error(
        error.response?.data.message ??
          "Login failed"
      );
    },
  });
};