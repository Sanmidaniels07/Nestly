"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { useSession } from "./use-session";
import {
  createPaymentLink,
  deletePaymentLink,
  getMyPaymentLinks,
  getPaymentLink,
  payPaymentLink,
  updatePaymentLink,
} from "../services/payment-link.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import {
  PaymentLinkPayload,
  PayPaymentLinkPayload,
  PublicPaymentLink,
  UpdatePaymentLinkPayload,
} from "../types/payment-link";

const MY_LINKS = ["payment-links", "me"];

const errorMessage = (error: AxiosError<ApiErrorResponse>, fallback: string) =>
  error.response?.data.message ?? fallback;

export const useMyPaymentLinks = (enabled = true) =>
  useQuery({
    queryKey: MY_LINKS,
    queryFn: getMyPaymentLinks,
    select: (response) => response.data,
    enabled,
  });

export const useCreatePaymentLink = () => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof createPaymentLink>>, AxiosError<ApiErrorResponse>, PaymentLinkPayload>({
    mutationFn: createPaymentLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LINKS }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't create the link")),
  });
};

export const useUpdatePaymentLink = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Awaited<ReturnType<typeof updatePaymentLink>>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdatePaymentLinkPayload }
  >({
    mutationFn: ({ id, data }) => updatePaymentLink(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LINKS }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't update the link")),
  });
};

export const useDeletePaymentLink = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deletePaymentLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_LINKS });
      toast.success("Link deleted");
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't delete the link")),
  });
};

// The pay page: starts from the server-rendered copy, then refetches with
// the viewer's login (isOwner) and the latest availability.
export const usePaymentLink = (code: string, initial?: ApiResponse<PublicPaymentLink>) => {
  const { isHydrated, isLoggedIn } = useSession();
  return useQuery({
    queryKey: ["payment-links", "public", code, isLoggedIn],
    queryFn: () => getPaymentLink(code),
    select: (response) => response.data,
    initialData: initial,
    initialDataUpdatedAt: 0,
    enabled: isHydrated,
  });
};

export const usePayPaymentLink = () =>
  useMutation<
    Awaited<ReturnType<typeof payPaymentLink>>,
    AxiosError<ApiErrorResponse>,
    { code: string; data: PayPaymentLinkPayload }
  >({
    mutationFn: ({ code, data }) => payPaymentLink(code, data),
    onError: (error) => toast.error(errorMessage(error, "Couldn't start the payment")),
  });
