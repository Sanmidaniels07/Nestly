import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { ClaimGiftPayload, Gift, SendGiftPayload, SendGiftResponse } from "../types/gift";

const path = (code: string) => `/gifts/${encodeURIComponent(code)}`;

export const sendGift = async (data: SendGiftPayload) => {
  const response = await api.post<ApiResponse<SendGiftResponse>>("/gifts", data);
  return response.data;
};

export const getGift = async (code: string) => {
  const response = await api.get<ApiResponse<Gift>>(path(code));
  return response.data;
};

export const listGifts = async (box: "sent" | "received", page = 1) => {
  const response = await api.get<ApiResponse<Paginated<"gifts", Gift>>>("/gifts", { params: { box, page, limit: 30 } });
  return response.data;
};

export const claimGift = async (code: string, data: ClaimGiftPayload) => {
  const response = await api.post<ApiResponse<Gift>>(`${path(code)}/claim`, data);
  return response.data;
};

export const declineGift = async (code: string) => {
  const response = await api.post<ApiResponse<Gift>>(`${path(code)}/decline`);
  return response.data;
};

export const cancelGift = async (code: string) => {
  const response = await api.post<ApiResponse<Gift>>(`${path(code)}/cancel`);
  return response.data;
};
