import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Notification } from "../types/notification";

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
