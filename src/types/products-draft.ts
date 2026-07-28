import { DraftImage } from "./product-image";
import { ProductCondition } from "./product";

export interface ProductDraft {
  // Step 1
  name: string;
  categoryId: string;
  brand: string;
  description: string;
  condition: ProductCondition;
  sku: string;

  // Step 2
  price: string;
  comparePrice: string;
  stock: string;

  // Step 3
  specifications: {
    id: string;
    key: string;
    value: string;
  }[];
  highlights: string[];

  // Step 4
  images: DraftImage[];

  // Legacy shipping step — kept for when the backend adds shipping/delivery
  // support. Not part of the real create-product flow today.
  weight: string;
  length: string;
  width: string;
  height: string;
  shippingFee: string;
  deliveryTime: string;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  freeDelivery: boolean;
  shippingRegions: string[];
}
