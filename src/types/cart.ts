import { MarketplaceProduct } from "../mocks/marketplace";

export interface CartItem {
  product: MarketplaceProduct;

  quantity: number;

  selected: boolean;

  
}