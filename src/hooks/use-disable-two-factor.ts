"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { disableTwoFactor } from "../services/twofactor.services";
import { ApiErrorResponse } from "../types/api";

export const useDisableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: disableTwoFactor,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Two-factor authentication disabled");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Invalid code");
    },
  });
};
