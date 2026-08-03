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
  createdAt: string;
  updatedAt: string;
  store?: Store | null;
}

export interface BecomeSellerPayload {
  cacNumber?: string;
}
