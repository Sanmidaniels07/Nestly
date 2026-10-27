import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { RecommendedProduct } from "../types/product";

export const getTrendingProducts = async (limit?: number) => {
  const response = await api.get<ApiResponse<RecommendedProduct[]>>(
    "/recommendations/trending",
    { params: { limit } }
  );
  return response.data;
};

export const getBestSellers = async (limit?: number, category?: string) => {
  const response = await api.get<ApiResponse<RecommendedProduct[]>>(
    "/recommendations/best-sellers",
    { params: { limit, category } }
  );
  return response.data;
};

export const getForYou = async (limit?: number) => {
  const response = await api.get<ApiResponse<RecommendedProduct[]>>(
    "/recommendations/for-you",
    { params: { limit } }
  );
  return response.data;
};

export const getRecentlyViewed = async (limit?: number) => {
  const response = await api.get<ApiResponse<RecommendedProduct[]>>(
    "/recommendations/recently-viewed",
    { params: { limit } }
  );
  return response.data;
};

export const recordProductView = async (productId: string) => {
  await api.post("/recommendations/views", { productId });
};
