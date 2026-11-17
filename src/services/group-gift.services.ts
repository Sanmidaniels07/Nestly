import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { ContributePayload, ContributionPayment, GroupGift, StartGroupGiftPayload } from "../types/group-gift";

// Chip in on a gift.
export const startGroupGift = async (data: StartGroupGiftPayload) => {
  const response = await api.post<ApiResponse<GroupGift>>("/group-gifts", data);
  return response.data;
};

export const getGroupGift = async (code: string) => {
  const response = await api.get<ApiResponse<GroupGift>>(`/group-gifts/${encodeURIComponent(code)}`);
  return response.data;
};

export const contributeToGroupGift = async (code: string, data: ContributePayload) => {
  const response = await api.post<ApiResponse<ContributionPayment>>(`/group-gifts/${encodeURIComponent(code)}/contribute`, data);
  return response.data;
};

export const verifyContribution = async (reference: string) => {
  const response = await api.post<ApiResponse<GroupGift>>(`/group-gifts/contributions/${encodeURIComponent(reference)}/verify`);
  return response.data;
};

export const cancelGroupGift = async (code: string) => {
  const response = await api.post<ApiResponse<GroupGift>>(`/group-gifts/${encodeURIComponent(code)}/cancel`);
  return response.data;
};
