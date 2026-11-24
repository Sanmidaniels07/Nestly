"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { useSession } from "./use-session";
import { useAuthStore } from "../store/auth-store";
import {
  claimGuestAccount,
  confirmGuestDelivery,
  createPaymentLink,
  deletePaymentLink,
  getGuestOrder,
  getMyPaymentLinks,
  getProductPayLink,
  getPaymentLink,
  guestPayPaymentLink,
  payPaymentLink,
  updatePaymentLink,
  verifyGuestOrder,
} from "../services/payment-link.services";
import { ApiErrorResponse, ApiResponse } from "../types/api";
import {
  GuestPayPaymentLinkPayload,
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

// "Share pay link" on a product. Errors are shown by the caller (inline).
export const useProductPayLink = () => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof getProductPayLink>>, AxiosError<ApiErrorResponse>, string>({
    mutationFn: getProductPayLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LINKS }),
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

// Guest checkout. No toast here - the pay page shows the error itself
// (and a "Log in" button when the email already has an account).
export const useGuestPayPaymentLink = () =>
  useMutation<
    Awaited<ReturnType<typeof guestPayPaymentLink>>,
    AxiosError<ApiErrorResponse>,
    { code: string; data: GuestPayPaymentLinkPayload }
  >({
    mutationFn: ({ code, data }) => guestPayPaymentLink(code, data),
  });

const guestOrderKey = (token: string) => ["guest-order", token];

// The guest's private order page. Refreshes now and then so a new status
// (shipped, delivered) shows without reloading.
export const useGuestOrder = (token: string) =>
  useQuery({
    queryKey: guestOrderKey(token),
    queryFn: () => getGuestOrder(token),
    select: (response) => response.data,
    refetchInterval: 60_000,
    retry: (count, error: AxiosError) => error.response?.status !== 404 && count < 2,
  });

export const useVerifyGuestOrder = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof verifyGuestOrder>>, AxiosError<ApiErrorResponse>, void>({
    mutationFn: () => verifyGuestOrder(token),
    onSuccess: (response) => queryClient.setQueryData(guestOrderKey(token), response),
  });
};

export const useConfirmGuestDelivery = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation<Awaited<ReturnType<typeof confirmGuestDelivery>>, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (orderItemId) => confirmGuestDelivery(token, orderItemId),
    onSuccess: (response) => {
      queryClient.setQueryData(guestOrderKey(token), response);
      toast.success("Thanks! Delivery confirmed");
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't confirm delivery")),
  });
};

// Sets a password on the guest account. When it signs them in, the
// session goes into the auth store like a normal login.
export const useClaimGuestAccount = (token: string) => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation<Awaited<ReturnType<typeof claimGuestAccount>>, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (password) => claimGuestAccount(token, password),
    onSuccess: (response) => {
      if (!response.data.emailSent) {
        setAuth(response.data.user, response.data.accessToken);
        queryClient.invalidateQueries({ queryKey: guestOrderKey(token) });
      }
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't set up your account")),
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
