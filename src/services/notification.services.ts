import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import {
  Notification,
  NotificationPreference,
  NotificationPreferenceType,
} from "../types/notification";

export const getNotifications = async () => {
  const response = await api.get<ApiResponse<Notification[]>>(
    "/notifications"
  );
  return response.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await api.patch<ApiResponse<Notification>>(
    `/notifications/${id}/read`
  );
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch<ApiResponse<null>>("/notifications/read-all");
  return response.data;
};

export const getNotificationPreferences = async () => {
  const response = await api.get<ApiResponse<NotificationPreference[]>>(
    "/notifications/preferences"
  );
  return response.data;
};

export const updateNotificationPreference = async (
  type: NotificationPreferenceType,
  enabled: boolean
) => {
  const response = await api.patch<ApiResponse<NotificationPreference>>(
    "/notifications/preferences",
    { type, enabled }
  );
  return response.data;
};
