// GET /stores/:slug/trust - what a seller has actually done on Nestly.
export type TrustLevel = "TRUSTED" | "ESTABLISHED" | "NEW";

export interface StoreTrust {
  store: { name: string; slug: string; logo: string | null; city: string | null; state: string | null };
  level: TrustLevel;
  // CAC-registered and checked.
  verifiedBusiness: boolean;
  // False while a quick-start store waits for Nestly's review.
  newlyReviewed: boolean;
  sellingSince: string;
  deliveredOrders: number;
  // % of finished items delivered rather than cancelled by the seller (null under 5).
  completionRate: number | null;
  // Median hours from order to sent out.
  typicalShipHours: number | null;
  // % of delivered items refunded after a problem (null under 5 deliveries).
  refundRate: number | null;
  problemReports: number;
  rating: number | null;
  reviewCount: number;
  followers: number;
  updatedAt: string;
}
