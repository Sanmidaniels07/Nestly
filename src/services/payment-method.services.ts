import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { SavedCard } from "../types/saved-card";

export const getSavedCards = async () => {
  const response = await api.get<ApiResponse<SavedCard[]>>("/payment-methods");
  return response.data;
};

export const deleteSavedCard = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/payment-methods/${id}`
  );
  return response.data;
};

export const setDefaultSavedCard = async (id: string) => {
  const response = await api.patch<ApiResponse<null>>(
    `/payment-methods/${id}/default`
  );
  return response.data;
};
