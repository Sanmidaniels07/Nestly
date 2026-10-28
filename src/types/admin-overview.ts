import { TrafficSource } from "../lib/traffic-source";

export type OverviewRange = 7 | 30 | 90;

/** UNKNOWN = sign-ups/orders from before sources were recorded. */
export type OverviewSource = TrafficSource | "UNKNOWN";

export interface AdminOverview {
  range: { days: OverviewRange; since: string; until: string };
  users: {
    total: number;
    new: number;
    newPrev: number;
    active: number;
    google: number;
    verified: number;
    suspended: number;
    banned: number;
  };
  sellers: {
    pending: number;
    approved: number;
    rejected: number;
    verified: number;
    readyToSell: number;
    newApplications: number;
    newApplicationsPrev: number;
    stores: number;
    suspendedStores: number;
  };
  products: { live: number; soldOut: number; drafts: number; paymentLinkItems: number };
  orders: {
    paid: number;
    paidPrev: number;
    /** What buyers paid on orders that went through (naira). */
    sales: number;
    salesPrev: number;
    commission: number;
    commissionPrev: number;
    averageOrder: number;
    deliveryFees: number;
    paymentLinkOrders: number;
    paymentLinkSales: number;
    /** Started paying but never finished. */
    unpaidCheckouts: number;
    cancelled: number;
    /** Sold-out refunds Paystack refused - refund by hand. */
    refundsToDo: number;
  };
  sources: {
    signups: { source: OverviewSource; count: number }[];
    orders: { source: OverviewSource; orders: number; sales: number }[];
  };
  engagement: { productViews: number; storeViews: number; profileViews: number };
  daily: { date: string; signups: number; orders: number; sales: number }[];
  topStores: { id: string; name: string; slug: string; orders: number; sales: number }[];
  topProducts: { id: string; title: string; storeName: string; isPaymentLink: boolean; units: number; sales: number }[];
}
