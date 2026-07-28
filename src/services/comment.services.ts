import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Comment } from "../types/comment";

export const createComment = async (postId: string, content: string) => {
  const response = await api.post<ApiResponse<Comment>>(
    `/comments/${postId}`,
    { content }
  );
  return response.data;
};

export const getComments = async (postId: string) => {
  const response = await api.get<ApiResponse<Comment[]>>(
    `/comments/post/${postId}`
  );
  return response.data;
};

export const updateComment = async (id: string, content: string) => {
  const response = await api.patch<ApiResponse<Comment>>(`/comments/${id}`, {
    content,
  });
  return response.data;
};

export const deleteComment = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/comments/${id}`);
  return response.data;
};
