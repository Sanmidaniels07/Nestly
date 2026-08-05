export interface ShippingOption {
  id: string;
  storeId: string;
  name: string;
  fee: number;
  etaDays?: number | null;
  createdAt: string;
}

export interface CreateShippingOptionPayload {
  name: string;
  fee: number;
  etaDays?: number;
}

export type UpdateShippingOptionPayload = Partial<CreateShippingOptionPayload>;

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
  // Present on the seller's own GET /stores/me response (not the public
  // store view). True while a recently-changed payout account is still
  // inside its fraud-prevention hold window.
  isOnHold?: boolean;
  holdHours?: number;
  reviewCount?: number;
  productCount?: number;
  seller?: StoreSeller;
  shippingOptions?: ShippingOption[];
  followersCount?: number;
  isFollowing?: boolean;
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
}

export interface Bank {
  name: string;
  code: string;
}

export interface SetupPayoutAccountPayload {
  bankCode: string;
  accountNumber: string;
}
