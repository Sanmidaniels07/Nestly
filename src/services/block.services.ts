import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { BlockedUser } from "../types/block";

export const blockUser = async (userId: string) => {
  const response = await api.post<ApiResponse<{ message: string }>>(
    `/blocks/${userId}`
  );
  return response.data;
};

export const unblockUser = async (userId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/blocks/${userId}`);
  return response.data;
};

export const getBlockedUsers = async (
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<
    ApiResponse<Paginated<"blockedUsers", BlockedUser>>
  >("/blocks", { params });
  return response.data;
};
