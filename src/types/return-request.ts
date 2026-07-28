export type ReturnRequestStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "REFUNDED";

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId?: string | null;
  userId: string;
  reason: string;
  status: ReturnRequestStatus;
  createdAt: string;
  updatedAt: string;
  orderItem?: {
    id: string;
    product: { id: string; title: string };
  } | null;
  user?: { id: string; name: string; email: string };
}

export interface CreateReturnRequestPayload {
  orderItemId: string;
  reason: string;
}

export interface ReturnRequestListParams {
  page?: number;
  limit?: number;
  status?: ReturnRequestStatus;
}
