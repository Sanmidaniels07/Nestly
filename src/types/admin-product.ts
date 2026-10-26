import { ProductStatus } from "./product";

export interface AdminProduct {
  id: string;
  title: string;
  sku: string;
  status: ProductStatus;
  price: number;
  /** Shown in the marketplace's featured sections - set by admins only. */
  isFeatured: boolean;
  updatedAt: string;
  reviewsResetAt: string | null;
  images: { url: string }[];
  store: { id: string; name: string; slug: string };
  _count: { revisions: number; reviews: number };
}

export interface AdminProductListParams {
  page?: number;
  limit?: number;
  search?: string;
}

// One field in a saved edit. Photos are lists of image URLs (cover first).
export interface ProductChange {
  field: string;
  from: string | string[] | null;
  to: string | string[] | null;
}

export interface ProductRevision {
  id: string;
  changes: ProductChange[];
  reviewsReset: boolean;
  createdAt: string;
  editedBy: { id: string; name: string; username?: string | null } | null;
}

export interface ProductHistory {
  product: {
    id: string;
    title: string;
    status: ProductStatus;
    createdAt: string;
    reviewsResetAt: string | null;
    store: { id: string; name: string; slug: string };
  };
  revisions: ProductRevision[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
