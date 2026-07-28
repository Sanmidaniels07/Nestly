export interface Notification {
  id: string;
  userId: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}
