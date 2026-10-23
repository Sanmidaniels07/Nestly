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

// Cart lines are addressed by their own id (the same product can be in
// the cart twice in different options).
export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await api.patch<ApiResponse<CartItem>>(`/cart/${itemId}`, {
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (itemId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/cart/${itemId}`);
  return response.data;
};
