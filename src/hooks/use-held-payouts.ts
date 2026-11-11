"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { getHeldPayouts, getMyPayouts, payHeldManually, runPayouts } from "../services/payout.services";
import { ApiErrorResponse } from "../types/api";

// Seller: what's coming, when, and what's been paid (hold-then-pay).
export const useMyPayouts = () =>
  useQuery({
    queryKey: ["payouts", "me"],
    queryFn: getMyPayouts,
    select: (response) => response.data,
  });

// Admin: money Nestly is holding per seller, and failed transfers.
export const useHeldPayouts = () =>
  useQuery({
    queryKey: ["payouts", "held"],
    queryFn: getHeldPayouts,
    select: (response) => response.data,
  });

const useRefreshPayouts = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["payouts"] });
};

export const usePayHeldManually = () => {
  const refresh = useRefreshPayouts();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, { storeId: string; note?: string }>({
    mutationFn: ({ storeId, note }) => payHeldManually(storeId, note),
    onSuccess: () => {
      refresh();
      toast.success("Payout recorded - the seller has been told");
    },
    onError: (error) => toast.error(error.response?.data.message ?? "Couldn't record the payout"),
  });
};

export const useRunPayouts = () => {
  const refresh = useRefreshPayouts();
  return useMutation({
    mutationFn: runPayouts,
    onSuccess: (response) => {
      refresh();
      const { transfers, ready } = response.data;
      toast.success(transfers > 0 ? `${transfers} transfer${transfers === 1 ? "" : "s"} sent` : ready > 0 ? "Nothing sent - see why below" : "Nothing ready to pay");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => toast.error(error.response?.data.message ?? "Payout run failed"),
  });
};
