export interface Payout {
  id: string;
  storeId: string;
  amount: number;
  note: string | null;
  createdBy?: string;
  createdAt: string;
  // MANUAL: recorded by Nestly. TRANSFER: automatic Paystack transfer.
  method?: "MANUAL" | "TRANSFER";
  // PENDING: transfer on its way. FAILED: admins only (the orders are paid again).
  status?: "PENDING" | "PAID" | "FAILED";
  // "GTBank ••••1234"
  bankLabel?: string | null;
  failureReason?: string | null;
  store?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreatePayoutPayload {
  storeId: string;
  amount: number;
  note?: string;
}

export interface PayoutListParams {
  page?: number;
  limit?: number;
  storeId?: string;
}

export interface SellerEarnings {
  totalRevenue: number;
  totalPaidOut: number;
  availableBalance: number;
}

export interface PayoutAccountChange {
  id: string;
  storeId: string;
  previousBankName: string | null;
  previousAccountNumber: string | null;
  newBankName: string;
  newAccountNumber: string;
  changedAt: string;
}

export interface StorePayoutInfo extends SellerEarnings {
  store: {
    id: string;
    name: string;
    payoutBankName: string | null;
    payoutAccountNumber: string | null;
    payoutAccountName: string | null;
    paystackSubaccountCode: string | null;
    payoutAccountUpdatedAt: string | null;
  };
  // True while a recently-changed payout account is still inside its
  // fraud-prevention hold window (see holdHours) and hasn't been eligible
  // for automatic checkout splits yet.
  isOnHold: boolean;
  holdHours: number;
  recentChanges: PayoutAccountChange[];
}

export interface StoreTraffic {
  totalViews: number;
  uniqueVisitors: number;
  followersCount: number;
  dailyViews: { date: string; views: number }[];
}

// ---- Hold-then-pay -----------------------------------------------------------

// Where one order stands for payout: delivery not confirmed yet, the buyer
// can still report a problem (until releaseAt), a report is open, ready for
// the next payout, or the transfer is on its way.
export type HeldOrderState = "AWAITING_DELIVERY" | "IN_RETURN_WINDOW" | "ON_HOLD" | "READY" | "PROCESSING";

export interface HeldOrder {
  orderId: string;
  orderNumber: string;
  orderedAt: string;
  state: HeldOrderState;
  amount: number;
  releaseAt: string | null;
  items: { title: string; quantity: number }[];
}

// GET /seller/payouts
export interface MyPayouts {
  holdPayouts: boolean;
  automaticTransfers: boolean;
  bankAccount: string | null;
  bankOnHoldUntil: string | null;
  totals: Record<HeldOrderState, number>;
  totalPaidOut: number;
  orders: HeldOrder[];
  payouts: (Payout & { orderCount: number })[];
  // Left from orders before hold-then-pay (paid by Nestly by hand).
  earlierBalance: number;
}

// GET /admin/payouts/held
export interface HeldPayoutsOverview {
  holdPayouts: boolean;
  automaticTransfers: boolean;
  stores: {
    id: string;
    name: string;
    slug: string;
    bankAccount: string | null;
    bankOnHoldUntil: string | null;
    totals: Record<HeldOrderState, number>;
  }[];
  failedTransfers: {
    id: string;
    amount: number;
    failureReason: string | null;
    createdAt: string;
    store: { id: string; name: string };
  }[];
}

export interface PayoutRunResult {
  settled: number;
  transfers: number;
  ready: number;
  skipped: Record<string, "NO_BANK_ACCOUNT" | "ACCOUNT_RECENTLY_CHANGED" | "ALREADY_PAID_TODAY" | "BELOW_MINIMUM">;
}
