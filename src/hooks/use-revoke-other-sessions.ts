"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { revokeOtherAccountSessions } from "../services/account.services";
import { ApiErrorResponse } from "../types/api";

export const useRevokeOtherSessions = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: revokeOtherAccountSessions,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "sessions"] });
      toast.success("Other sessions signed out");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to sign out other sessions");
    },
  });
};
