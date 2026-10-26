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
  | "COMMISSION_CHANGE"
  | "CAC_REMINDER"
  | "SELLER_SETUP"
  | "ADMIN_CAC_SUBMITTED"
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
