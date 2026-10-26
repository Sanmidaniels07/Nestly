import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";

export interface StockAlertInput {
  productId: string;
  /** The sold-out option combination, for products with options. */
  variationId?: string;
}

export const createStockAlert = async (input: StockAlertInput) => {
  const response = await api.post<ApiResponse<unknown>>("/stock-alerts", input);
  return response.data;
};

export const deleteStockAlert = async (input: StockAlertInput) => {
  const response = await api.delete<ApiResponse<null>>("/stock-alerts", { data: input });
  return response.data;
};

/** Options the user is waiting for on this product (null = the whole product). */
export const getMyStockAlerts = async (productId: string) => {
  const response = await api.get<ApiResponse<{ variationIds: (string | null)[] }>>(`/stock-alerts/${productId}`);
  return response.data;
};
