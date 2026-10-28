"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { googleAuth } from "../services/auth.services";
import { useAuthStore } from "../store/auth-store";
import { getSafeReturnTo, rememberReturnTo, rememberedReturnTo } from "../lib/return-to";
import { referralCode } from "../lib/referral";
import { trafficSource } from "../lib/traffic-source";
import { ApiErrorResponse, AuthResponse } from "../types/auth";

// Continue with Google on the login and signup pages. New accounts go to the
// welcome step first; 2FA accounts get the code challenge (the caller shows
// it when the response has requires2FA).
export const useGoogleAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (returnTo) rememberReturnTo(returnTo);
  }, [returnTo]);

  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (credential) => googleAuth({ credential, referralCode: referralCode(), source: trafficSource() }),

    onSuccess: (response) => {
      if ("requires2FA" in response.data) return;

      const { accessToken, user, isNewUser } = response.data;
      setAuth(user, accessToken);

      if (isNewUser) {
        toast.success("Welcome to Nestly!");
        router.push("/welcome");
        return;
      }

      toast.success("Logged in successfully");
      router.push(returnTo ?? rememberedReturnTo() ?? "/dashboard");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Google sign-in failed");
    },
  });
};
