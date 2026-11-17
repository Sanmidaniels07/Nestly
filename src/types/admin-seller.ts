import { CacCheckResult, CacCompanyType, SellerApplicationStatus } from "./seller";

export interface AdminSeller {
  id: string;
  status: SellerApplicationStatus;
  statusReason: string | null;
  cacNumber: string | null;
  cacCompanyType: CacCompanyType | null;
  cacCheckResult: CacCheckResult | null;
  cacCheckedName: string | null;
  cacCheckedStatus: string | null;
  cacCheckedAt: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  };
  // underReview: a quick-start store not reviewed yet (payouts held, orders capped).
  store: { id: string; name: string; slug: string; isSuspended?: boolean; underReview?: boolean; createdAt?: string; salesStoppedAt?: string | null } | null;
}

export interface AdminSellerListParams {
  page?: number;
  limit?: number;
  status?: SellerApplicationStatus;
  // Only quick-start sellers waiting for a review.
  needsReview?: boolean;
}

// Rejecting a seller who has a store: STOP_SALES lets them finish orders
// already paid; FRAUD cancels and refunds everything not yet delivered.
export type RejectMode = "STOP_SALES" | "FRAUD";

export interface UpdateSellerStatusPayload {
  status: "APPROVED" | "REJECTED";
  reason?: string;
  rejectMode?: RejectMode;
}

// GET /admin/sellers/:id/open-orders - what's in progress before rejecting.
export interface SellerOpenOrders {
  openOrders: number;
  openAmount: number;
  refundableOrders: number;
  refundableAmount: number;
  manualOrders: number;
  heldAmount: number;
}

// PATCH status with FRAUD: what was refunded automatically.
export interface FraudRefundResult {
  refunded: number;
  refundedAmount: number;
  failed: number;
  manual: number;
}
