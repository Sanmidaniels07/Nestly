import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { AddToCartPayload, CartItem } from "../types/cart";

export const getCart = async () => {
  const response = await api.get<ApiResponse<{ items: CartItem[] }>>("/cart");
  return response.data;
};

export const addToCart = async (data: AddToCartPayload) => {
  const response = await api.post<ApiResponse<CartItem>>("/cart", data);
  return response.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await api.patch<ApiResponse<CartItem>>(`/cart/${productId}`, {
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (productId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/cart/${productId}`);
  return response.data;
};
