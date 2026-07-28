import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { TrendingHashtag } from "../types/hashtag";
import { Post } from "../types/post";

export const getTrendingHashtags = async (limit?: number, days?: number) => {
  const response = await api.get<ApiResponse<TrendingHashtag[]>>(
    "/hashtags/trending",
    { params: { limit, days } }
  );
  return response.data;
};

export const getPostsByHashtag = async (
  tag: string,
  params: { page?: number; limit?: number } = {}
) => {
  const response = await api.get<ApiResponse<Paginated<"posts", Post>>>(
    `/hashtags/${tag}/posts`,
    { params }
  );
  return response.data;
};
