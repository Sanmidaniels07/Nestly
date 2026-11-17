import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { CreateOfferPayload, Message, RespondOfferPayload } from "../types/conversation";

// Make an offer in chat.
export const createOffer = async (data: CreateOfferPayload) => {
  const response = await api.post<ApiResponse<Message>>("/offers", data);
  return response.data;
};

export const respondOffer = async (id: string, data: RespondOfferPayload) => {
  const response = await api.post<ApiResponse<unknown>>(`/offers/${encodeURIComponent(id)}/respond`, data);
  return response.data;
};

export const withdrawOffer = async (id: string) => {
  const response = await api.post<ApiResponse<unknown>>(`/offers/${encodeURIComponent(id)}/withdraw`);
  return response.data;
};
