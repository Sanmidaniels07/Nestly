"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { changePassword } from "../services/account.services";
import { useAuthStore } from "../store/auth-store";
import { ApiErrorResponse } from "../types/api";

export const useChangePassword = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: changePassword,

    onSuccess: () => {
      toast.success("Password changed. Please log in again.");
      logout();
      router.push("/login");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to change password");
    },
  });
};
