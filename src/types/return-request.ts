export type ReturnRequestStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "REFUNDED";

/** What went wrong - only these qualify under Nestly's returns policy. */
export type ReturnReason = "DAMAGED" | "SPOILED" | "WRONG_ITEM" | "NOT_AS_DESCRIBED" | "FAULTY" | "NOT_RECEIVED";

export const RETURN_REASON_LABEL: Record<ReturnReason, string> = {
  DAMAGED: "Damaged",
  SPOILED: "Spoiled or expired",
  WRONG_ITEM: "Wrong item",
  NOT_AS_DESCRIBED: "Not as described",
  FAULTY: "Faulty",
  NOT_RECEIVED: "Not received",
};

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId?: string | null;
  userId: string;
  reasonType?: ReturnReason | null;
  reason: string;
  photos?: string[];
  status: ReturnRequestStatus;
  createdAt: string;
  updatedAt: string;
  orderItem?: {
    id: string;
    product: { id: string; title: string };
  } | null;
  user?: { id: string; name: string };
}

export interface CreateReturnRequestPayload {
  orderItemId: string;
  reasonType: ReturnReason;
  reason: string;
  photos?: string[];
}

export interface ReturnRequestListParams {
  page?: number;
  limit?: number;
  status?: ReturnRequestStatus;
}
