"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { revokeAccountSession } from "../services/account.services";
import { ApiErrorResponse } from "../types/api";

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: revokeAccountSession,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "sessions"] });
      toast.success("Session revoked");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to revoke session");
    },
  });
};
