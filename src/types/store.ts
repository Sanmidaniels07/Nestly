import { DeliveryVehicle } from "../lib/delivery-vehicle";
export type ShippingOptionType = "DELIVERY" | "PICKUP";

// A delivery zone (a price for a group of areas; no areas = any buyer), or
// a pickup point (always free; the buyer collects from the seller).
export interface ShippingOption {
  id: string;
  storeId: string;
  name: string;
  fee: number;
  eta?: string | null;
  type: ShippingOptionType;
  areas: string[];
  state?: string | null;
  pickupAddress?: string | null;
  // Delivery only. Null on zones made before vehicles existed (any product).
  vehicle?: DeliveryVehicle | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateShippingOptionPayload {
  name?: string;
  fee: number;
  eta?: string;
  areas?: string[];
  state?: string;
  type?: ShippingOptionType;
  pickupAddress?: string;
  vehicle?: DeliveryVehicle;
}

export interface UpdateShippingOptionPayload extends Partial<Omit<CreateShippingOptionPayload, "eta" | "pickupAddress" | "vehicle">> {
  eta?: string | null;
  pickupAddress?: string | null;
  vehicle?: DeliveryVehicle | null;
  isArchived?: boolean;
}

export interface StoreSeller {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerified: boolean;
  user: { id: string; name: string };
}

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
  totalSales?: number;
  isVerified?: boolean;
  isSuspended?: boolean;
  returnPolicy?: string | null;
  shippingPolicy?: string | null;
  warrantyPolicy?: string | null;
  payoutBankName?: string | null;
  payoutBankCode?: string | null;
  payoutAccountNumber?: string | null;
  payoutAccountName?: string | null;
  paystackSubaccountCode?: string | null;
  payoutAccountUpdatedAt?: string | null;
  
  isOnHold?: boolean;
  holdHours?: number;
  reviewCount?: number;
  productCount?: number;
  seller?: StoreSeller;
  shippingOptions?: ShippingOption[];
  followersCount?: number;
  isFollowing?: boolean;
  /** Store listings only: up to 3 recent published products. */
  previewProducts?: StorePreviewProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface StorePreviewProduct {
  id: string;
  title: string;
  price: number;
  image: string | null;
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
  returnPolicy?: string;
  shippingPolicy?: string;
  warrantyPolicy?: string;
}

export type UpdateStorePayload = Partial<CreateStorePayload>;

export interface StoreListParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  sort?: "newest" | "trending";
}

export interface Bank {
  name: string;
  code: string;
}

export interface SetupPayoutAccountPayload {
  bankCode: string;
  accountNumber: string;
}
