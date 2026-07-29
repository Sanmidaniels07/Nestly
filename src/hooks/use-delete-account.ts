"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { deleteAccount } from "../services/account.services";
import { useAuthStore } from "../store/auth-store";
import { ApiErrorResponse } from "../types/api";

export const useDeleteAccount = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteAccount,

    onSuccess: () => {
      toast.success("Account deleted");
      logout();
      router.push("/login");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to delete account");
    },
  });
};
