"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { createPayout } from "../services/payout.services";
import { ApiErrorResponse } from "../types/api";
import { CreatePayoutPayload } from "../types/payout";

export const useCreatePayout = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreatePayoutPayload>({
    mutationFn: createPayout,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      toast.success("Payout recorded");
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Failed to record payout");
    },
  });
};
