import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { OrderItem } from "../types/order";
import { Product } from "../types/product";
import { Payout, SellerEarnings, StoreTraffic } from "../types/payout";

export interface SellerCustomer {
  user: { id: string; name: string; email: string };
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
}

export interface SellerDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  storeRating?: number;
}

export interface SellerSalesPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SellerTopProduct {
  product: Product;
  unitsSold: number;
  revenue: number;
}

export interface SellerRevenueByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
}

export interface SellerAnalytics {
  orderStatusBreakdown: Record<string, number>;
  revenueByCategory: SellerRevenueByCategory[];
}

export interface SellerRecentOrder {
  id: string;
  status: string;
  createdAt: string;
  customer: { id: string; name: string; email: string };
  items: OrderItem[];
  sellerSubtotal: number;
}

export interface LowStockProduct {
  id: string;
  title: string;
  sku: string;
  stock: number;
  price: number;
  brand?: string | null;
  images: { url: string; isPrimary?: boolean }[];
}

export interface InventorySnapshot {
  totalProducts: number;
  publishedCount: number;
  draftCount: number;
  outOfStockCount: number;
  lowStockThreshold: number;
  lowStockProducts: LowStockProduct[];
}

export const getSellerDashboardStats = async () => {
  const response = await api.get<ApiResponse<SellerDashboardStats>>(
    "/seller/dashboard/stats"
  );
  return response.data;
};

export const getSellerInventory = async (threshold?: number) => {
  const response = await api.get<ApiResponse<InventorySnapshot>>(
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
  const response = await api.get<ApiResponse<SellerRecentOrder[]>>(
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

export const getSellerAnalytics = async () => {
  const response = await api.get<ApiResponse<SellerAnalytics>>(
    "/seller/dashboard/analytics"
  );
  return response.data;
};

export const getSellerCustomers = async (params: { page?: number; limit?: number }) => {
  const response = await api.get<
    ApiResponse<Paginated<"customers", SellerCustomer>>
  >("/seller/dashboard/customers", { params });
  return response.data;
};

export const getSellerEarnings = async () => {
  const response = await api.get<ApiResponse<SellerEarnings>>(
    "/seller/dashboard/earnings"
  );
  return response.data;
};

export const getStoreTraffic = async (days?: number) => {
  const response = await api.get<ApiResponse<StoreTraffic>>(
    "/seller/dashboard/traffic",
    { params: { days } }
  );
  return response.data;
};

export const getSellerPayouts = async (params: { page?: number; limit?: number }) => {
  const response = await api.get<ApiResponse<Paginated<"payouts", Payout>>>(
    "/seller/dashboard/payouts",
    { params }
  );
  return response.data;
};
