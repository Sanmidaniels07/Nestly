export interface ReferralStats {
  /** Goes on share links as ?ref=<code>. */
  code: string;
  /** Percentage points off the commission for referred buyers' orders. */
  rewardPercent: number;
  /** How long after a buyer joins their orders earn the reward. */
  rewardDays: number;
  visitsLast30Days: number;
  visitsTotal: number;
  buyersJoined: number;
  ordersFromReferrals: number;
  salesFromReferrals: number;
  commissionSaved: number;
}
