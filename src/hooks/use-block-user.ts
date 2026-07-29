"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { blockUser } from "../services/block.services";
import { ApiErrorResponse } from "../types/api";

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: blockUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      toast.success("User blocked");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to block user");
    },
  });
};
