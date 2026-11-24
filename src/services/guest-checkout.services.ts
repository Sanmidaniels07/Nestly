import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { GuestCartQuote, GuestCheckoutPayload, GuestCheckoutResponse } from "../types/guest-checkout";
import { GuestCartLine } from "../store/guest-cart-store";

// Shopping without an account: price the browser-kept cart, and pay for it.

export const getGuestCartQuote = async (items: GuestCartLine[]) => {
  const response = await api.post<ApiResponse<GuestCartQuote>>("/checkout/guest/quote", { items });
  return response.data;
};

export const guestCheckout = async (data: GuestCheckoutPayload) => {
  const response = await api.post<ApiResponse<GuestCheckoutResponse>>("/checkout/guest", data);
  return response.data;
};
