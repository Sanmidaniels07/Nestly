import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { Product } from "../types/product";
import { Review } from "../types/review";
import {
  CreateStorePayload,
  Store,
  StoreListParams,
  UpdateStorePayload,
} from "../types/store";

export const createStore = async (data: CreateStorePayload) => {
  const response = await api.post<ApiResponse<Store>>("/stores", data);
  return response.data;
};

export const getStores = async (params: StoreListParams) => {
  const response = await api.get<ApiResponse<Paginated<"stores", Store>>>(
    "/stores",
    { params }
  );
  return response.data;
};

export const getMyStore = async () => {
  const response = await api.get<ApiResponse<Store>>("/stores/me");
  return response.data;
};

export const getStoreBySlug = async (slug: string) => {
  const response = await api.get<ApiResponse<Store>>(`/stores/${slug}`);
  return response.data;
};

export const updateStore = async (id: string, data: UpdateStorePayload) => {
  const response = await api.patch<ApiResponse<Store>>(`/stores/${id}`, data);
  return response.data;
};

export const getStoreProducts = async (
  slug: string,
  params: { page?: number; limit?: number }
) => {
  const response = await api.get<ApiResponse<Paginated<"products", Product>>>(
    `/stores/${slug}/products`,
    { params }
  );
  return response.data;
};

export const getStoreReviews = async (
  slug: string,
  params: { page?: number; limit?: number }
) => {
  const response = await api.get<ApiResponse<Paginated<"reviews", Review>>>(
    `/stores/${slug}/reviews`,
    { params }
  );
  return response.data;
};
