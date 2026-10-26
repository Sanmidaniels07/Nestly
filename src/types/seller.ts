import { Store } from "./store";

export type SellerApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SellerProfile {
  id: string;
  userId: string;
  status: SellerApplicationStatus;
  statusReason?: string | null;
  statusUpdatedAt?: string | null;
  // Only populated (non-null) when status is REJECTED.
  reapplyEligibleAt?: string | null;
  canReapply?: boolean;
  cacNumber?: string | null;
  // CAC number checked by an admin - drives the store's verified badge.
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  store?: Store | null;
}

// GET /seller/me/readiness - what's left before buyers can order.
export interface SellerReadinessStep {
  key: "STORE" | "PAYOUT" | "DELIVERY" | "PRODUCT";
  title: string;
  why: string;
  path: string;
}

export interface SellerReadiness {
  ready: boolean;
  missing: SellerReadinessStep[];
}

export interface BecomeSellerPayload {
  cacNumber?: string;
}
