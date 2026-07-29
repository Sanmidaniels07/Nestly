import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  AdminUser,
  AdminUserListParams,
  UpdateUserStatusPayload,
  UpdateUserStatusResponse,
  UserRole,
} from "../types/admin-user";

export const getAdminUsers = async (params: AdminUserListParams) => {
  const response = await api.get<ApiResponse<Paginated<"users", AdminUser>>>(
    "/admin/users",
    { params }
  );
  return response.data;
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const response = await api.patch<ApiResponse<AdminUser>>(
    `/admin/users/${id}/role`,
    { role }
  );
  return response.data;
};

export const updateUserStatus = async (id: string, data: UpdateUserStatusPayload) => {
  const response = await api.patch<ApiResponse<UpdateUserStatusResponse>>(
    `/admin/users/${id}/status`,
    data
  );
  return response.data;
};
