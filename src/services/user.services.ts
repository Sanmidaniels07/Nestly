import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { PublicUser, SuggestedUser, UserListParams, UserProfile } from "../types/user";

export const getUsers = async (params: UserListParams) => {
  const response = await api.get<ApiResponse<Paginated<"users", PublicUser>>>(
    "/users",
    { params }
  );
  return response.data;
};

export const getSuggestedUsers = async (limit?: number) => {
  const response = await api.get<ApiResponse<SuggestedUser[]>>(
    "/users/suggested",
    { params: { limit } }
  );
  return response.data;
};

export const getUserProfile = async (identifier: string) => {
  const response = await api.get<ApiResponse<UserProfile>>(
    `/users/${identifier}`
  );
  return response.data;
};
