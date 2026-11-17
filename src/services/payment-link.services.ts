import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import {
  ClaimGuestAccountResponse,
  GuestOrder,
  GuestPayPaymentLinkPayload,
  GuestPayPaymentLinkResponse,
  PaymentLink,
  PaymentLinkPayload,
  PayPaymentLinkPayload,
  PayPaymentLinkResponse,
  PublicPaymentLink,
  UpdatePaymentLinkPayload,
} from "../types/payment-link";

export const getMyPaymentLinks = async () => {
  const response = await api.get<ApiResponse<PaymentLink[]>>("/payment-links/me");
  return response.data;
};

export const createPaymentLink = async (data: PaymentLinkPayload) => {
  const response = await api.post<ApiResponse<PaymentLink>>("/payment-links", data);
  return response.data;
};

export const updatePaymentLink = async (id: string, data: UpdatePaymentLinkPayload) => {
  const response = await api.patch<ApiResponse<PaymentLink>>(`/payment-links/${id}`, data);
  return response.data;
};

export const deletePaymentLink = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/payment-links/${id}`);
  return response.data;
};

export const getPaymentLink = async (code: string) => {
  const response = await api.get<ApiResponse<PublicPaymentLink>>(`/payment-links/${encodeURIComponent(code)}`);
  return response.data;
};

export const payPaymentLink = async (code: string, data: PayPaymentLinkPayload) => {
  const response = await api.post<ApiResponse<PayPaymentLinkResponse>>(
    `/payment-links/${encodeURIComponent(code)}/pay`,
    data
  );
  return response.data;
};

// Guest checkout - no login; the order's token is the access.
export const guestPayPaymentLink = async (code: string, data: GuestPayPaymentLinkPayload) => {
  const response = await api.post<ApiResponse<GuestPayPaymentLinkResponse>>(
    `/payment-links/${encodeURIComponent(code)}/guest-pay`,
    data
  );
  return response.data;
};

const guestOrderPath = (token: string) => `/payment-links/guest-orders/${encodeURIComponent(token)}`;

export const getGuestOrder = async (token: string) => {
  const response = await api.get<ApiResponse<GuestOrder>>(guestOrderPath(token));
  return response.data;
};

export const verifyGuestOrder = async (token: string) => {
  const response = await api.post<ApiResponse<GuestOrder>>(`${guestOrderPath(token)}/verify`);
  return response.data;
};

export const confirmGuestDelivery = async (token: string, orderItemId: string) => {
  const response = await api.post<ApiResponse<GuestOrder>>(
    `${guestOrderPath(token)}/items/${encodeURIComponent(orderItemId)}/confirm-delivery`
  );
  return response.data;
};

export const claimGuestAccount = async (token: string, password: string) => {
  const response = await api.post<ApiResponse<ClaimGuestAccountResponse>>(`${guestOrderPath(token)}/claim`, { password });
  return response.data;
};
