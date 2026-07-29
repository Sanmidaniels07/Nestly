export type UserAccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED";
export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: UserRole;
  status: UserAccountStatus;
  statusReason: string | null;
  isVerified: boolean;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserAccountStatus;
}

export interface UpdateUserStatusPayload {
  status: UserAccountStatus;
  reason?: string;
}

export interface UpdateUserStatusResponse extends AdminUser {
  storeSuspended: boolean | null;
}
