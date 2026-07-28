import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreateStoryPayload,
  Story,
  StoryAuthorGroup,
  StoryDetail,
  StoryReaction,
  StoryViewer,
} from "../types/story";

export const createStory = async (data: CreateStoryPayload) => {
  const response = await api.post<ApiResponse<Story>>("/stories", data);
  return response.data;
};

export const getStoriesFeed = async () => {
  const response = await api.get<ApiResponse<StoryAuthorGroup[]>>("/stories");
  return response.data;
};

export const getStory = async (id: string) => {
  const response = await api.get<ApiResponse<StoryDetail>>(`/stories/${id}`);
  return response.data;
};

export const deleteStory = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/stories/${id}`);
  return response.data;
};

export const getStoryViewers = async (
  id: string,
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<ApiResponse<Paginated<"views", StoryViewer>>>(
    `/stories/${id}/viewers`,
    { params }
  );
  return response.data;
};

export const reactToStory = async (id: string, emoji: string) => {
  const response = await api.post<ApiResponse<StoryReaction>>(
    `/stories/${id}/react`,
    { emoji }
  );
  return response.data;
};

export const removeStoryReaction = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/stories/${id}/react`);
  return response.data;
};
