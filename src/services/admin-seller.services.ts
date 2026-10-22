import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  AdminSeller,
  AdminSellerListParams,
  UpdateSellerStatusPayload,
} from "../types/admin-seller";

export const getAdminSellers = async (params: AdminSellerListParams) => {
  const response = await api.get<ApiResponse<Paginated<"sellers", AdminSeller>>>(
    "/admin/sellers",
    { params }
  );
  return response.data;
};

export const updateSellerStatus = async (
  id: string,
  data: UpdateSellerStatusPayload
) => {
  const response = await api.patch<ApiResponse<AdminSeller>>(
    `/admin/sellers/${id}/status`,
    data
  );
  return response.data;
};

// Manual CAC check result - also drives the store's public verified badge.
export const setSellerVerified = async (id: string, isVerified: boolean) => {
  const response = await api.patch<ApiResponse<AdminSeller>>(
    `/admin/sellers/${id}/verify`,
    { isVerified }
  );
  return response.data;
};
