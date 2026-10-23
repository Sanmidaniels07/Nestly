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

// Old free-form name/value rows from before options existed (seller-only).
export interface LegacyProductVariant {
  id?: string;
  name: string;
  value: string;
  price?: number | null;
  stock?: number | null;
}

// A choice buyers make, e.g. Size: [Small, Medium, Large].
export interface ProductOption {
  id?: string;
  name: string;
  values: string[];
  position?: number;
}

// One combination of option values (option2 is "" with a single option).
export interface ProductVariation {
  id: string;
  option1: string;
  option2: string;
  price: number | null;
  stock: number;
  isActive: boolean;
}

export interface OptionInput {
  name: string;
  values: string[];
}

export interface VariationInput {
  option1: string;
  option2?: string;
  price?: number | null;
  stock: number;
  isActive?: boolean;
}

export type ProductCondition = "NEW" | "USED" | "REFURBISHED" | "FRESHLY_MADE" | "MADE_TO_ORDER" | "PRE_ORDER";
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
  options?: ProductOption[];
  variations?: ProductVariation[];
  legacyVariants?: LegacyProductVariant[];
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
  // Sent together; [] removes options. Leave out to keep them as they are.
  options?: OptionInput[];
  variations?: VariationInput[];
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
