import { SellerApplicationStatus } from "./seller";

export interface AdminSeller {
  id: string;
  status: SellerApplicationStatus;
  statusReason: string | null;
  cacNumber: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  };
}

export interface AdminSellerListParams {
  page?: number;
  limit?: number;
  status?: SellerApplicationStatus;
}

export interface UpdateSellerStatusPayload {
  status: "APPROVED" | "REJECTED";
  reason?: string;
}
