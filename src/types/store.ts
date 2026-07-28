export interface Store {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  rating?: number;
  reviewCount?: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStorePayload {
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export type UpdateStorePayload = Partial<CreateStorePayload>;

export interface StoreListParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
}
