"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { useSession } from "./use-session";
import { cancelGroupGift, contributeToGroupGift, getGroupGift, startGroupGift } from "../services/group-gift.services";
import { ApiErrorResponse } from "../types/api";
import { ContributePayload, StartGroupGiftPayload } from "../types/group-gift";

const key = (code: string) => ["group-gift", code];

// A group gift's page. Refetched with the viewer's login (their own
// contribution, organiser controls) and every 30 seconds while it's open,
// so the progress bar moves as friends chip in.
export const useGroupGift = (code: string) => {
  const { isHydrated, isLoggedIn } = useSession();
  return useQuery({
    queryKey: [...key(code), isLoggedIn],
    queryFn: () => getGroupGift(code),
    select: (response) => response.data,
    enabled: isHydrated,
    refetchInterval: (query) => (query.state.data?.data.status === "OPEN" ? 30_000 : false),
    retry: (count, error) => (error as AxiosError).response?.status !== 404 && count < 2,
  });
};

export const useStartGroupGift = () =>
  useMutation<Awaited<ReturnType<typeof startGroupGift>>, AxiosError<ApiErrorResponse>, StartGroupGiftPayload>({
    mutationFn: startGroupGift,
  });

// Starts the Paystack payment for a contribution; the page confirms it after the popup.
export const useContribute = (code: string) =>
  useMutation<Awaited<ReturnType<typeof contributeToGroupGift>>, AxiosError<ApiErrorResponse>, ContributePayload>({
    mutationFn: (data) => contributeToGroupGift(code, data),
  });

export const useCancelGroupGift = (code: string) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => cancelGroupGift(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(code) });
      toast.success("Called off - everyone is being refunded");
    },
    onError: (error) => toast.error(error.response?.data.message ?? "Couldn't call it off"),
  });
};
