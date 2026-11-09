"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { cancelGift, claimGift, declineGift, getGift, listGifts, sendGift } from "../services/gift.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { ClaimGiftPayload, Gift, SendGiftPayload } from "../types/gift";

const errorMessage = (error: AxiosError<ApiErrorResponse>, fallback: string) => error.response?.data.message ?? fallback;

export const giftKey = (code: string) => ["gift", code];

// Keyed by viewer: the page changes with who is looking (and after login).
export const useGift = (code: string, viewerId?: string) =>
  useQuery<ApiResponse<Gift>, AxiosError<ApiErrorResponse>, Gift>({
    queryKey: [...giftKey(code), viewerId ?? "guest"],
    queryFn: () => getGift(code),
    select: (response) => response.data,
    retry: (count, error) => error.response?.status !== 404 && count < 2,
  });

export const useGiftList = (box: "sent" | "received") =>
  useQuery({
    queryKey: ["gifts", box],
    queryFn: () => listGifts(box),
    select: (response) => response.data,
  });

export const useSendGift = () =>
  useMutation<Awaited<ReturnType<typeof sendGift>>, AxiosError<ApiErrorResponse>, SendGiftPayload>({
    mutationFn: sendGift,
    onError: (error) => toast.error(errorMessage(error, "Couldn't start the gift. Please try again.")),
  });

const useGiftAction = <TVars,>(fn: (vars: TVars) => Promise<ApiResponse<Gift>>, fallback: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Gift>, AxiosError<ApiErrorResponse>, TVars>({
    mutationFn: fn,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: giftKey(response.data.code) });
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => toast.error(errorMessage(error, fallback)),
  });
};

export const useClaimGift = () =>
  useGiftAction(({ code, data }: { code: string; data: ClaimGiftPayload }) => claimGift(code, data), "Couldn't accept the gift.");

export const useDeclineGift = () => useGiftAction((code: string) => declineGift(code), "Couldn't decline the gift.");

export const useCancelGift = () => useGiftAction((code: string) => cancelGift(code), "Couldn't cancel the gift.");
