// A buyer's report of a problem with a delivered item. The seller answers by
// sellerRespondBy (refund, replacement or disagree); Nestly decides disputes.
// While a report is open the seller's payout for that order is held.
export type ReturnRequestStatus =
  | "REQUESTED" // waiting for the seller
  | "APPROVED" // older requests only
  | "REPLACEMENT" // seller is sending a replacement
  | "REPLACED" // replacement received
  | "DISPUTED" // Nestly is deciding
  | "WITHDRAWN" // buyer kept the item
  | "REFUNDED"
  | "REJECTED"; // closed in the seller's favour

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

export const RETURN_STATUS_LABEL: Record<ReturnRequestStatus, string> = {
  REQUESTED: "Waiting for seller",
  APPROVED: "Approved",
  REPLACEMENT: "Replacement on its way",
  REPLACED: "Replaced",
  DISPUTED: "Nestly is reviewing",
  WITHDRAWN: "Kept by buyer",
  REFUNDED: "Refunded",
  REJECTED: "Closed",
};

export const RETURN_STATUS_TONE: Record<ReturnRequestStatus, string> = {
  REQUESTED: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  REPLACEMENT: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  REPLACED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  DISPUTED: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300",
  WITHDRAWN: "bg-surface-muted text-muted",
  REFUNDED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-surface-muted text-muted",
};

/** Still being sorted out (the seller's payout for the order is on hold). */
export const OPEN_RETURN_STATUSES: ReturnRequestStatus[] = ["REQUESTED", "APPROVED", "REPLACEMENT", "DISPUTED"];

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId?: string | null;
  userId: string;
  reasonType?: ReturnReason | null;
  reason: string;
  photos?: string[];
  status: ReturnRequestStatus;
  sellerRespondBy?: string | null;
  sellerResponse?: string | null;
  sellerRespondedAt?: string | null;
  escalatedAt?: string | null;
  resolvedAt?: string | null;
  resolutionNote?: string | null;
  refundAmount?: number | null;
  // REQUESTED: sent to the buyer's card/bank. FAILED: Nestly sends it by hand.
  refundStatus?: "REQUESTED" | "FAILED" | null;
  createdAt: string;
  updatedAt: string;
  orderItem?: {
    id: string;
    product: { id: string; title: string; store?: { id?: string; name: string; slug?: string } };
  } | null;
  user?: { id: string; name: string; email?: string };
  // Admin list only.
  order?: { paymentReference: string | null };
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

export type SellerReturnAction = "REFUND" | "REPLACE" | "DISAGREE";
export type BuyerReturnAction = "KEEP" | "REPLACEMENT_RECEIVED" | "REPLACEMENT_PROBLEM";
export type ReturnDecision = "REFUND" | "REJECT";
