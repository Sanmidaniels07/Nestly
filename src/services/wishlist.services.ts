import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import { WishlistItem, WishlistVisibility } from "../types/wishlist";

export const getWishlist = async (params: { page?: number; limit?: number } = {}) => {
  const response = await api.get<ApiResponse<Paginated<"items", WishlistItem> & { visibility: WishlistVisibility }>>(
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

export const updateWishlistVisibility = async (visibility: WishlistVisibility) => {
  const response = await api.patch<ApiResponse<{ wishlistVisibility: WishlistVisibility }>>("/wishlist/visibility", {
    visibility,
  });
  return response.data;
};

/** Someone else's wishlist (gift ideas) - only when they share it with you. */
export const getUserWishlist = async (identifier: string, page = 1) => {
  const response = await api.get<
    ApiResponse<
      Paginated<"items", WishlistItem> & {
        owner: { id: string; name: string; username: string | null };
        visibility: WishlistVisibility;
      }
    >
  >(`/users/${encodeURIComponent(identifier)}/wishlist`, { params: { page, limit: 24 } });
  return response.data;
};
