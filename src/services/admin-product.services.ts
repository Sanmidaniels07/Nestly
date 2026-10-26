import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { AdminProduct, AdminProductListParams, ProductHistory } from "../types/admin-product";

export const getAdminProducts = async (params: AdminProductListParams) => {
  const response = await api.get<ApiResponse<Paginated<"products", AdminProduct>>>(
    "/admin/products",
    { params }
  );
  return response.data;
};

// Every saved edit to a product - what changed, who and when.
export const getProductHistory = async (id: string, params: { page?: number; limit?: number }) => {
  const response = await api.get<ApiResponse<ProductHistory>>(
    `/admin/products/${id}/history`,
    { params }
  );
  return response.data;
};

// Featured products appear in the marketplace's featured sections.
export const setProductFeatured = async (id: string, isFeatured: boolean) => {
  const response = await api.patch<ApiResponse<{ id: string; isFeatured: boolean }>>(`/admin/products/${id}/featured`, { isFeatured });
  return response.data;
};
