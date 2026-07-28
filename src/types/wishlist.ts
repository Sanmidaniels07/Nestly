import { Product } from "./product";

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}
