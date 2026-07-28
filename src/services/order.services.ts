import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { Order, OrderListParams } from "../types/order";

export const getOrders = async (params: OrderListParams) => {
  const response = await api.get<ApiResponse<Paginated<"orders", Order>>>("/orders", {
    params,
  });
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id: string) => {
  const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
  return response.data;
};

export const getSellerOrders = async (params: OrderListParams) => {
  const response = await api.get<ApiResponse<Paginated<"orders", Order>>>(
    "/orders/seller",
    { params }
  );
  return response.data;
};

export const getSellerOrder = async (id: string) => {
  const response = await api.get<ApiResponse<Order>>(`/orders/seller/${id}`);
  return response.data;
};

export const updateOrderItemStatus = async (orderItemId: string, status: string) => {
  const response = await api.patch<ApiResponse<Order>>(
    `/orders/seller/items/${orderItemId}/status`,
    { status }
  );
  return response.data;
};

export const updateOrderTrackingNumber = async (id: string, trackingNumber: string) => {
  const response = await api.patch<ApiResponse<Order>>(
    `/orders/seller/${id}/tracking-number`,
    { trackingNumber }
  );
  return response.data;
};
