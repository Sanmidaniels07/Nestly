import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  AdminSeller,
  AdminSellerListParams,
  FraudRefundResult,
  SellerOpenOrders,
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
  const response = await api.patch<ApiResponse<AdminSeller & { refunds?: FraudRefundResult | null }>>(
    `/admin/sellers/${id}/status`,
    data
  );
  return response.data;
};

// Before rejecting: open orders, what fraud mode would refund, money held.
export const getSellerOpenOrders = async (id: string) => {
  const response = await api.get<ApiResponse<SellerOpenOrders>>(`/admin/sellers/${id}/open-orders`);
  return response.data;
};

// Manual CAC check result - also drives the store's public verified badge.
// Runs the automatic CAC lookup (Dojah) again for a seller.
export const recheckSellerCac = async (id: string) => {
  const response = await api.post<ApiResponse<AdminSeller>>(`/admin/sellers/${id}/cac-check`);
  return response.data;
};

export const setSellerVerified = async (id: string, isVerified: boolean) => {
  const response = await api.patch<ApiResponse<AdminSeller>>(
    `/admin/sellers/${id}/verify`,
    { isVerified }
  );
  return response.data;
};
