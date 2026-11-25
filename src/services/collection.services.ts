import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { CollectionPayload, PublicCollection, SellerCollection } from "../types/collection";

export const getMyCollections = async () => {
  const response = await api.get<ApiResponse<SellerCollection[]>>("/collections/me");
  return response.data.data;
};

export const createCollection = async (data: CollectionPayload) => {
  const response = await api.post<ApiResponse<SellerCollection>>("/collections", data);
  return response.data.data;
};

export const updateCollection = async (id: string, data: Partial<CollectionPayload> & { isActive?: boolean }) => {
  const response = await api.patch<ApiResponse<SellerCollection>>(`/collections/${id}`, data);
  return response.data.data;
};

export const deleteCollection = async (id: string) => {
  await api.delete(`/collections/${id}`);
};

export const getPublicCollection = async (store: string, slug: string) => {
  const response = await api.get<ApiResponse<PublicCollection>>(`/collections/${encodeURIComponent(store)}/${encodeURIComponent(slug)}`);
  return response.data.data;
};
