export type NotificationTargetType =
  | "POST"
  | "USER"
  | "CONVERSATION"
  | "PRODUCT"
  | "SELLER_APPLICATION";

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
  | "SYSTEM";

export interface NotificationPreference {
  type: NotificationPreferenceType;
  enabled: boolean;
}
