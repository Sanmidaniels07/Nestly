import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { Product } from "../types/product";
import { Review } from "../types/review";
import {
  CreateShippingOptionPayload,
  CreateStorePayload,
  ShippingOption,
  Store,
  StoreListParams,
  UpdateShippingOptionPayload,
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

export const followStore = async (slug: string) => {
  const response = await api.post<ApiResponse<{ id: string }>>(
    `/stores/${slug}/follow`
  );
  return response.data;
};

export const unfollowStore = async (slug: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/stores/${slug}/follow`
  );
  return response.data;
};

export const getStoreFollowStatus = async (slug: string) => {
  const response = await api.get<ApiResponse<{ isFollowing: boolean }>>(
    `/stores/${slug}/follow/status`
  );
  return response.data;
};

export const createShippingOption = async (
  slug: string,
  data: CreateShippingOptionPayload
) => {
  const response = await api.post<ApiResponse<ShippingOption>>(
    `/stores/${slug}/shipping-options`,
    data
  );
  return response.data;
};

export const updateShippingOption = async (
  slug: string,
  optionId: string,
  data: UpdateShippingOptionPayload
) => {
  const response = await api.patch<ApiResponse<ShippingOption>>(
    `/stores/${slug}/shipping-options/${optionId}`,
    data
  );
  return response.data;
};

export const deleteShippingOption = async (
  slug: string,
  optionId: string
) => {
  const response = await api.delete<ApiResponse<null>>(
    `/stores/${slug}/shipping-options/${optionId}`
  );
  return response.data;
};

export const verifyStore = async (id: string, isVerified: boolean) => {
  const response = await api.patch<ApiResponse<Store>>(
    `/stores/${id}/verify`,
    { isVerified }
  );
  return response.data;
};
