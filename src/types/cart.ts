import { Product, ProductVariation } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  // Set for products with options.
  variationId?: string | null;
  variation?: ProductVariation | null;
  // The chosen option's price, else the product's.
  unitPrice?: number;
  // e.g. "Size: Large · Flavour: Vanilla"
  variantLabel?: string | null;
}

export interface AddToCartPayload {
  productId: string;
  variationId?: string;
  quantity?: number;
}
