"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { useSession } from "./use-session";
import {
  banLiveViewer,
  buyFromLive,
  cancelLive,
  createLive,
  endLive,
  getLive,
  getLives,
  getLiveSummary,
  getMyLives,
  pinLiveProduct,
  removeLiveMessage,
  setLiveReminder,
  updateLive,
} from "../services/live.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import { BuyFromLivePayload, LivePayload, PublicLive } from "../types/live";

const MY_LIVES = ["lives", "me"];

const errorMessage = (error: AxiosError<ApiErrorResponse>, fallback: string) => error.response?.data.message ?? fallback;

// Seller

export const useMyLives = (enabled = true) =>
  useQuery({ queryKey: MY_LIVES, queryFn: getMyLives, select: (response) => response.data, enabled });

export const useCreateLive = () => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof createLive>>, AxiosError<ApiErrorResponse>, LivePayload>({
    mutationFn: createLive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LIVES }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't schedule the live")),
  });
};

export const useUpdateLive = () => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof updateLive>>, AxiosError<ApiErrorResponse>, { id: string; data: Partial<LivePayload> }>({
    mutationFn: ({ id, data }) => updateLive(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LIVES }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't update the live")),
  });
};

export const useCancelLive = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: cancelLive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_LIVES });
      toast.success("Live cancelled - people waiting have been told");
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't cancel the live")),
  });
};

export const useEndLive = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: endLive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LIVES }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't end the live")),
  });
};

export const usePinLiveProduct = () =>
  useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; productId: string | null }>({
    mutationFn: ({ id, productId }) => pinLiveProduct(id, productId),
    onError: (error) => toast.error(errorMessage(error, "Couldn't pin that")),
  });

export const useRemoveLiveMessage = () =>
  useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; messageId: string }>({
    mutationFn: ({ id, messageId }) => removeLiveMessage(id, messageId),
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove the message")),
  });

export const useBanLiveViewer = () =>
  useMutation<unknown, AxiosError<ApiErrorResponse>, { id: string; userId: string }>({
    mutationFn: ({ id, userId }) => banLiveViewer(id, userId),
    onSuccess: () => toast.success("They can't chat in this live any more"),
    onError: (error) => toast.error(errorMessage(error, "Couldn't block them")),
  });

export const useLiveSummary = (id: string | null) =>
  useQuery({
    queryKey: ["lives", "summary", id],
    queryFn: () => getLiveSummary(id as string),
    select: (response) => response.data,
    enabled: !!id,
  });

// Public

export const useLives = (store?: string) =>
  useQuery({
    queryKey: ["lives", "list", store ?? "all"],
    queryFn: () => getLives(store),
    select: (response) => response.data,
    // "Live now" changes - keep it fresh while the page is open.
    refetchInterval: 60_000,
  });

export const liveQueryKey = (code: string, isLoggedIn: boolean) => ["lives", "public", code, isLoggedIn];

// Starts from the server-rendered copy, then refetches with the viewer's login.
export const useLive = (code: string, initial?: ApiResponse<PublicLive>) => {
  const { isHydrated, isLoggedIn } = useSession();
  return useQuery({
    queryKey: liveQueryKey(code, isLoggedIn),
    queryFn: () => getLive(code),
    select: (response) => response.data,
    initialData: initial,
    initialDataUpdatedAt: 0,
    enabled: isHydrated,
    // Backup for the socket: a waiting page notices the seller going live.
    refetchInterval: (query) => (query.state.data?.data?.status === "SCHEDULED" ? 15000 : false),
  });
};

export const useLiveReminder = (code: string) => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof setLiveReminder>>, AxiosError<ApiErrorResponse>, boolean>({
    mutationFn: (on) => setLiveReminder(code, on),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lives", "public", code] });
      toast.success(response.data.isInterested ? "We'll remind you before it starts" : "Reminder removed");
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't save that")),
  });
};

export const useBuyFromLive = () =>
  useMutation<Awaited<ReturnType<typeof buyFromLive>>, AxiosError<ApiErrorResponse>, { code: string; data: BuyFromLivePayload }>({
    mutationFn: ({ code, data }) => buyFromLive(code, data),
    onError: (error) => toast.error(errorMessage(error, "Couldn't start the payment")),
  });
