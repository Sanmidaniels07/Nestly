import { Product } from "./product";

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

/** Who can see your wishlist - followers get gift ideas from it. */
export type WishlistVisibility = "PRIVATE" | "FOLLOWERS" | "EVERYONE";
