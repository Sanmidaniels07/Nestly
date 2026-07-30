import { Store } from "./store";

export type SellerApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SellerProfile {
  id: string;
  userId: string;
  status: SellerApplicationStatus;
  statusReason?: string | null;
  cacNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: Store | null;
}

export interface BecomeSellerPayload {
  cacNumber?: string;
}
