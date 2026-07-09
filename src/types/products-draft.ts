import { ProductImage } from "./product-image";

export interface ProductDraft {
  // Step 1
  name: string;
  category: string;
  brand: string;
  description: string;
  condition: string;
  sku: string;
  tags: string[];

  // Step 2
  price: string;
  comparePrice: string;
  stock: string;
  lowStock: string;
  status: "Active" | "Draft";

  // Step 3
  specifications: {
    id: string;
    key: string;
    value: string;
  }[];

  // Step 4
  images: ProductImage[];
  // Step 5
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
