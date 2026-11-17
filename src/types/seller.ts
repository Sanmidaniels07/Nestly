import { Store } from "./store";

export type SellerApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CacCompanyType =
  | "BUSINESS_NAME"
  | "COMPANY"
  | "INCORPORATED_TRUSTEES"
  | "LIMITED_PARTNERSHIP"
  | "LIMITED_LIABILITY_PARTNERSHIP";

// What the automatic CAC lookup found (see the backend's CacCheckResult).
export type CacCheckResult = "VERIFIED" | "AWAITING_STORE" | "NAME_MISMATCH" | "INACTIVE" | "NOT_FOUND" | "FAILED";

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
  cacCompanyType?: CacCompanyType | null;
  // The automatic CAC lookup: result, the registered name and status, when.
  cacCheckResult?: CacCheckResult | null;
  cacCheckedName?: string | null;
  cacCheckedStatus?: string | null;
  cacCheckedAt?: string | null;
  // CAC number verified (automatically or by an admin) - drives the store's verified badge.
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  store?: Store | null;
  // Store still under review: the most one order from it can be (naira).
  orderLimit?: number | null;
  // ...and what Nestly is holding for it until the review (naira).
  heldForReview?: number | null;
}

// POST /seller/quick-start - a live store in one step.
export interface QuickStartSellerPayload {
  storeName: string;
  instagram?: string;
  whatsapp?: string;
  cacNumber?: string;
  cacCompanyType?: CacCompanyType;
  agreeToSellerTerms: true;
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
  cacCompanyType?: CacCompanyType;
}
