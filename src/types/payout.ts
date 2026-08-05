export interface Payout {
  id: string;
  storeId: string;
  amount: number;
  note: string | null;
  createdBy: string;
  createdAt: string;
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
