import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import {
  BuyFromLivePayload,
  BuyFromLiveResponse,
  HostSession,
  LiveListing,
  LivePayload,
  LiveSummary,
  MyLives,
  PublicLive,
  SellerLive,
  WatchToken,
  LiveStage,
} from "../types/live";

const code = (value: string) => encodeURIComponent(value);

// Seller

export const getMyLives = async () => (await api.get<ApiResponse<MyLives>>("/lives/me")).data;

export const createLive = async (data: LivePayload) => (await api.post<ApiResponse<SellerLive>>("/lives", data)).data;

export const updateLive = async (id: string, data: Partial<LivePayload>) =>
  (await api.patch<ApiResponse<SellerLive>>(`/lives/${id}`, data)).data;

export const cancelLive = async (id: string) => (await api.post<ApiResponse<SellerLive>>(`/lives/${id}/cancel`)).data;

export const startLive = async (id: string) => (await api.post<ApiResponse<HostSession>>(`/lives/${id}/start`)).data;

export const getHostToken = async (id: string) => (await api.post<ApiResponse<HostSession>>(`/lives/${id}/host-token`)).data;

export const endLive = async (id: string) => (await api.post<ApiResponse<{ id: string }>>(`/lives/${id}/end`)).data;

export const pinLiveProduct = async (id: string, productId: string | null) =>
  (await api.post<ApiResponse<{ pinnedProductId: string | null }>>(`/lives/${id}/pin`, { productId })).data;

export const removeLiveMessage = async (id: string, messageId: string) =>
  (await api.delete<ApiResponse<{ id: string }>>(`/lives/${id}/messages/${messageId}`)).data;

export const setBuyerMedia = async (id: string, userId: string, source: "microphone" | "camera", action: "off" | "block" | "allow") =>
  (await api.post<ApiResponse<LiveStage>>(`/lives/${id}/participants/${userId}/media`, { source, action })).data;

export const setLiveStage = async (id: string, body: { muteAll?: boolean; mics?: "on" | "off"; cams?: "on" | "off" }) =>
  (await api.post<ApiResponse<LiveStage>>(`/lives/${id}/stage`, body)).data;

export const banLiveViewer = async (id: string, userId: string) =>
  (await api.post<ApiResponse<{ userId: string }>>(`/lives/${id}/bans`, { userId })).data;

export const getLiveSummary = async (id: string) => (await api.get<ApiResponse<LiveSummary>>(`/lives/${id}/summary`)).data;

// Public

export const getLives = async (store?: string) =>
  (await api.get<ApiResponse<LiveListing>>("/lives", { params: store ? { store } : undefined })).data;

export const getLive = async (liveCode: string) => (await api.get<ApiResponse<PublicLive>>(`/lives/${code(liveCode)}`)).data;

export const setLiveReminder = async (liveCode: string, on: boolean) => {
  const url = `/lives/${code(liveCode)}/interest`;
  const response = on
    ? await api.post<ApiResponse<{ isInterested: boolean; interestedCount: number }>>(url)
    : await api.delete<ApiResponse<{ isInterested: boolean; interestedCount: number }>>(url);
  return response.data;
};

export const getWatchToken = async (liveCode: string) =>
  (await api.post<ApiResponse<WatchToken>>(`/lives/${code(liveCode)}/watch`)).data;

export const buyFromLive = async (liveCode: string, data: BuyFromLivePayload) =>
  (await api.post<ApiResponse<BuyFromLiveResponse>>(`/lives/${code(liveCode)}/buy`, data)).data;

/** The "Add to calendar" file (opened directly, no login needed). */
export const liveCalendarUrl = (liveCode: string) =>
  `${(process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "")}/lives/${code(liveCode)}/calendar.ics`;
