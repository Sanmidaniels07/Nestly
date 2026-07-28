import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreatePostPayload,
  Post,
  PostListParams,
  UpdatePostPayload,
} from "../types/post";

export const createPost = async (data: CreatePostPayload) => {
  const response = await api.post<ApiResponse<Post>>("/posts", data);
  return response.data;
};

export const getPosts = async (params: PostListParams) => {
  const response = await api.get<ApiResponse<Paginated<"posts", Post>>>(
    "/posts",
    { params }
  );
  return response.data;
};

export const getPost = async (id: string) => {
  const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return response.data;
};

export const updatePost = async (id: string, data: UpdatePostPayload) => {
  const response = await api.patch<ApiResponse<Post>>(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/posts/${id}`);
  return response.data;
};
