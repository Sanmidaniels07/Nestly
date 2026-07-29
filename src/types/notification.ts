export interface Notification {
  id: string;
  userId: string;
  message: string;
  type?: string;
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
