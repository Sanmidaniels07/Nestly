import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { FollowStatus } from "../types/follow";
import { PublicUser } from "../types/user";

export const followUser = async (userId: string) => {
  const response = await api.post<ApiResponse<{ id: string }>>(
    `/follow/${userId}`
  );
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/follow/${userId}`);
  return response.data;
};

export const getFollowStatus = async (userId: string) => {
  const response = await api.get<ApiResponse<FollowStatus>>(
    `/follow/${userId}/status`
  );
  return response.data;
};

export const getFollowers = async (
  userId: string,
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<ApiResponse<Paginated<"followers", PublicUser>>>(
    `/follow/${userId}/followers`,
    { params }
  );
  return response.data;
};

export const getFollowing = async (
  userId: string,
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<ApiResponse<Paginated<"following", PublicUser>>>(
    `/follow/${userId}/following`,
    { params }
  );
  return response.data;
};
