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

export interface StorePayoutInfo extends SellerEarnings {
  store: {
    id: string;
    name: string;
    payoutBankName: string | null;
    payoutAccountNumber: string | null;
    payoutAccountName: string | null;
    paystackSubaccountCode: string | null;
  };
}

export interface StoreTraffic {
  totalViews: number;
  uniqueVisitors: number;
  followersCount: number;
  dailyViews: { date: string; views: number }[];
}
