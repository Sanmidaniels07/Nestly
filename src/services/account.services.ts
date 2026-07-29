import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { AccountSession } from "../types/auth";

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch<ApiResponse<{ message: string }>>(
    "/account/password",
    data
  );
  return response.data;
};

export const deleteAccount = async (password: string) => {
  const response = await api.delete<ApiResponse<{ message: string }>>(
    "/account",
    { data: { password } }
  );
  return response.data;
};

export const getAccountSessions = async () => {
  const response = await api.get<ApiResponse<AccountSession[]>>(
    "/account/sessions"
  );
  return response.data;
};

export const revokeAccountSession = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/account/sessions/${id}`
  );
  return response.data;
};

export const revokeOtherAccountSessions = async () => {
  const response = await api.delete<ApiResponse<null>>(
    "/account/sessions/others"
  );
  return response.data;
};
