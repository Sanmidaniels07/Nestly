import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Category } from "../types/category";

export const getCategories = async () => {
  const response = await api.get<ApiResponse<Category[]>>("/categories");
  return response.data;
};

export const getFeaturedCategories = async (limit?: number) => {
  const response = await api.get<ApiResponse<Category[]>>(
    "/categories/featured",
    { params: { limit } }
  );
  return response.data;
};

export const getPopularCategories = async (limit?: number) => {
  const response = await api.get<ApiResponse<Category[]>>(
    "/categories/popular",
    { params: { limit } }
  );
  return response.data;
};

export const getCategoryBySlug = async (slug: string) => {
  const response = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
  return response.data;
};
