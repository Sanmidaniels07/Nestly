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
  store: { id: string; name: string; slug: string; isSuspended?: boolean; underReview?: boolean; createdAt?: string } | null;
}

export interface AdminSellerListParams {
  page?: number;
  limit?: number;
  status?: SellerApplicationStatus;
  // Only quick-start sellers waiting for a review.
  needsReview?: boolean;
}

export interface UpdateSellerStatusPayload {
  status: "APPROVED" | "REJECTED";
  reason?: string;
}
