import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Order } from "../types/order";
import {
  ChargeSavedCardPayload,
  InitiateCheckoutPayload,
  InitiateCheckoutResponse,
  VerifyCheckoutResponse,
} from "../types/checkout";

export const initiateCheckout = async (data: InitiateCheckoutPayload) => {
  const response = await api.post<ApiResponse<InitiateCheckoutResponse>>(
    "/checkout/initiate",
    data
  );
  return response.data;
};

export const verifyCheckout = async (reference: string) => {
  const response = await api.get<ApiResponse<VerifyCheckoutResponse>>(
    `/checkout/verify/${reference}`
  );
  return response.data;
};

export const chargeSavedCard = async (data: ChargeSavedCardPayload) => {
  const response = await api.post<ApiResponse<Order>>(
    "/checkout/charge-saved-card",
    data
  );
  return response.data;
};
