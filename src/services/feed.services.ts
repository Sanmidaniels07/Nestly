import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { ShoppingFeedPage } from "../types/shopping-feed";

// The shopping feed, a page at a time (before = the previous page's nextBefore).
export const getShoppingFeed = async (before?: string) => {
  const response = await api.get<ApiResponse<ShoppingFeedPage>>("/feed", { params: { limit: 20, ...(before ? { before } : {}) } });
  return response.data;
};
