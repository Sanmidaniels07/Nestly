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
  images: File[];

  // Step 5
  weight: string;
  shippingFee: string;
  deliveryTime: string;
}