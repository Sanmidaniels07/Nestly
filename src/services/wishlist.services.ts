import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { WishlistItem } from "../types/wishlist";

export const getWishlist = async (params: { page?: number; limit?: number } = {}) => {
  const response = await api.get<ApiResponse<Paginated<"items", WishlistItem>>>(
    "/wishlist",
    { params }
  );
  return response.data;
};

export const addToWishlist = async (productId: string) => {
  const response = await api.post<ApiResponse<WishlistItem>>("/wishlist", {
    productId,
  });
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/wishlist/${productId}`);
  return response.data;
};
