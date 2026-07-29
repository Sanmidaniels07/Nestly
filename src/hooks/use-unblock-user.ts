"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { unblockUser } from "../services/block.services";
import { ApiErrorResponse } from "../types/api";

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: unblockUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      toast.success("User unblocked");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to unblock user");
    },
  });
};
