import { Category } from "./category";

export interface ProductImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
}

export interface ProductSpecification {
  id?: string;
  name: string;
  value: string;
}

export interface ProductVariant {
  id?: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

// Local editable shape used by the create/edit forms — price/stock stay as
// strings while being typed, same convention as EditableSpecification.
export interface EditableVariant {
  id: string;
  name: string;
  value: string;
  price: string;
  stock: string;
}

export type ProductCondition = "NEW" | "USED" | "REFURBISHED";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK" | "ARCHIVED";

export interface ProductStoreSummary {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  title: string;
  description: string;
  sku: string;
  brand?: string | null;
  condition: ProductCondition;
  price: number;
  originalPrice?: number | null;
  stock: number;
  isFeatured?: boolean;
  highlights?: string[];
  status: ProductStatus;
  images: ProductImage[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  store?: ProductStoreSummary;
  category?: Category;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  categoryId: string;
  title: string;
  description: string;
  sku: string;
  brand?: string;
  condition: ProductCondition;
  price: number;
  originalPrice?: number;
  stock: number;
  isFeatured?: boolean;
  highlights?: string[];
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
}

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  status?: ProductStatus;
};

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  brand?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
}

export interface NearbyProductParams {
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
}

export interface MyProductParams {
  page?: number;
  limit?: number;
  status?: ProductStatus;
}

export interface BulkUpdateProductStatusPayload {
  productIds: string[];
  status: ProductStatus;
}

export interface BulkDeleteProductsPayload {
  productIds: string[];
}
