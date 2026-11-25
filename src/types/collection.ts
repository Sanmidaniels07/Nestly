import { ProductOption, ProductVariation } from "./product";

// A seller's group of products shared as one link (nestlyapp.site/{store}/{slug}).
export interface SellerCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  // "/tolas-fabrics/owambe-outfits"
  path: string;
  createdAt: string;
  updatedAt: string;
  products: { id: string; title: string; price: number; status: string; image: string | null }[];
}

export interface CollectionPayload {
  name: string;
  description?: string | null;
  productIds: string[];
}

export interface CollectionProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  soldOut: boolean;
  images: { url: string; isPrimary: boolean }[];
  options: ProductOption[];
  variations: ProductVariation[];
}

export interface PublicCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  store: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    brandColor: string | null;
    isVerified: boolean;
    city: string | null;
    state: string | null;
    referralCode: string | null;
    canDeliver: boolean;
  };
  products: CollectionProduct[];
}
