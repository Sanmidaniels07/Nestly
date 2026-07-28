import { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
}
