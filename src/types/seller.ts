import { Store } from "./store";

export interface SellerProfile {
  id: string;
  userId: string;
  cacNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: Store | null;
}

export interface BecomeSellerPayload {
  cacNumber?: string;
}
