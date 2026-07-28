import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";

export const likePost = async (postId: string) => {
  const response = await api.post<ApiResponse<null>>(`/likes/${postId}`);
  return response.data;
};

export const unlikePost = async (postId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/likes/${postId}`);
  return response.data;
};

export const getLikes = async (postId: string) => {
  const response = await api.get<
    ApiResponse<{ totalLikes: number; likedByMe: boolean }>
  >(`/likes/${postId}`);
  return response.data;
};
