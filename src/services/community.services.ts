import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  Community,
  CommunityListParams,
  CreateCommunityPayload,
} from "../types/community";

export const createCommunity = async (data: CreateCommunityPayload) => {
  const response = await api.post<ApiResponse<Community>>("/communities", data);
  return response.data;
};

export const getCommunities = async (params: CommunityListParams) => {
  const response = await api.get<ApiResponse<Paginated<"communities", Community>>>(
    "/communities",
    { params }
  );
  return response.data;
};

export const getTrendingCommunities = async (limit?: number) => {
  const response = await api.get<ApiResponse<Community[]>>(
    "/communities/trending",
    { params: { limit } }
  );
  return response.data;
};

export const getMyCommunities = async (
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<ApiResponse<Paginated<"communities", Community>>>(
    "/communities/me",
    { params }
  );
  return response.data;
};

export const getCommunityBySlug = async (slug: string) => {
  const response = await api.get<ApiResponse<Community>>(`/communities/${slug}`);
  return response.data;
};

export const joinCommunity = async (slug: string) => {
  const response = await api.post<ApiResponse<unknown>>(
    `/communities/${slug}/join`
  );
  return response.data;
};

export const leaveCommunity = async (slug: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/communities/${slug}/leave`
  );
  return response.data;
};

export const deleteCommunity = async (slug: string) => {
  const response = await api.delete<ApiResponse<null>>(`/communities/${slug}`);
  return response.data;
};
