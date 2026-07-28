import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Profile, UpdateProfilePayload } from "../types/profile";

export const getProfile = async () => {
  const response = await api.get<ApiResponse<Profile>>("/profile");
  return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const response = await api.patch<ApiResponse<Profile>>("/profile", data);
  return response.data;
};
