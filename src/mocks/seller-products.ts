import { nearbyProducts } from "./marketplace";

export const sellerProducts = nearbyProducts.map((product) => ({
  ...product,

  sku: `SKU-${product.id}`,

  active: true,

  totalSold: Math.floor(Math.random() * 500),

  views: Math.floor(Math.random() * 5000),
}));