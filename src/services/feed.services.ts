import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { FeedArea, ShoppingFeedPage } from "../types/shopping-feed";

// The shopping feed, a page at a time (before = the previous page's
// nextBefore). near: only stores serving the viewer's area.
export const getShoppingFeed = async (before?: string, near = false) => {
  const response = await api.get<ApiResponse<ShoppingFeedPage>>("/feed", {
    params: { limit: 20, ...(before ? { before } : {}), ...(near ? { near: "true" } : {}) },
  });
  return response.data;
};

export const getFeedArea = async () => {
  const response = await api.get<ApiResponse<FeedArea | null>>("/feed/area");
  return response.data;
};

export const setFeedArea = async (data: { state: string; area?: string | null }) => {
  const response = await api.put<ApiResponse<FeedArea>>("/feed/area", data);
  return response.data;
};

export const getFeedAreaOptions = async (state: string) => {
  const response = await api.get<ApiResponse<{ state: string; areas: string[] }>>("/feed/area/options", { params: { state } });
  return response.data;
};
