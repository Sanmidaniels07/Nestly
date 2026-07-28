import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Order } from "../types/order";
import { Product } from "../types/product";

export interface SellerDashboardStats {
  productCount: number;
  orderCount: number;
  customerCount?: number;
  revenue: number;
  rating?: number;
  reviewCount?: number;
}

export interface SellerSalesPoint {
  date: string;
  sales: number;
}

export interface SellerTopProduct {
  product: Product;
  sold: number;
  revenue: number;
}

export const getSellerDashboardStats = async () => {
  const response = await api.get<ApiResponse<SellerDashboardStats>>(
    "/seller/dashboard/stats"
  );
  return response.data;
};

export const getSellerInventory = async (threshold?: number) => {
  const response = await api.get<ApiResponse<Product[]>>(
    "/seller/dashboard/inventory",
    { params: { threshold } }
  );
  return response.data;
};

export const getSellerSalesOverview = async (days?: number) => {
  const response = await api.get<ApiResponse<SellerSalesPoint[]>>(
    "/seller/dashboard/sales-overview",
    { params: { days } }
  );
  return response.data;
};

export const getSellerRecentOrders = async (limit?: number) => {
  const response = await api.get<ApiResponse<Order[]>>(
    "/seller/dashboard/recent-orders",
    { params: { limit } }
  );
  return response.data;
};

export const getSellerTopProducts = async (limit?: number) => {
  const response = await api.get<ApiResponse<SellerTopProduct[]>>(
    "/seller/dashboard/top-products",
    { params: { limit } }
  );
  return response.data;
};
