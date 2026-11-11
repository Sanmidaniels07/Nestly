export type NotificationTargetType =
  | "POST"
  | "USER"
  | "CONVERSATION"
  | "PRODUCT"
  | "SELLER_APPLICATION"
  | "ADMIN_SELLER_APPLICATION"
  | "ADMIN_PAYOUT_ACCOUNT_CHANGED"
  | "ORDER"
  | "SELLER_ORDER"
  | "BIRTHDAY"
  | "BIRTHDAY_SOON"
  | "GIFT"
  | "SELLER_AGREEMENT"
  | "COMMISSION_CHANGE"
  | "CAC_REMINDER"
  | "SELLER_SETUP"
  | "PROFILE_SETUP"
  | "ADMIN_CAC_SUBMITTED"
  // A sold-out order's automatic refund failed - refund it in Paystack.
  | "ADMIN_REFUND_NEEDED"
  // Returns: a dispute for Nestly to decide, or a refund to send by hand.
  | "ADMIN_DISPUTE"
  // An automatic seller payout (Paystack transfer) failed.
  | "ADMIN_PAYOUT_FAILED"
  // A problem report on the seller's order, the seller's payouts, the buyer's reports.
  | "SELLER_RETURNS"
  | "SELLER_EARNINGS"
  | "MY_RETURNS"
  // Shopping updates for buyers.
  | "PRODUCT_PAGE"
  | "STORE_PAGE"
  | "CART";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  targetType?: NotificationTargetType | null;
  targetId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export type NotificationPreferenceType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "MESSAGE"
  | "ORDER"
  | "SYSTEM"
  | "SHOPPING";

export interface NotificationPreference {
  type: NotificationPreferenceType;
  enabled: boolean;
}
