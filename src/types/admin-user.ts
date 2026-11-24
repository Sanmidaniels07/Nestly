import { Paginated } from "./api";

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
  /** Still a guest: checked out without an account and hasn't set one up yet. */
  isGuest: boolean;
  /** First guest checkout. null = never checked out as a guest. */
  guestSince: string | null;
  /** When the guest turned it into a full account (null for older sign-ups). */
  guestJoinedAt: string | null;
  /** When they tapped "No thanks" on the make-an-account offer after checkout. */
  guestDeclinedAt: string | null;
  signupSource: string | null;
  /** Paid orders. */
  _count: { orders: number };
}

export type AdminGuestFilter = "all" | "signed_up" | "not_signed_up" | "declined";

export interface AdminGuestSummary {
  total: number;
  signedUp: number;
  notSignedUp: number;
  declined: number;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserAccountStatus;
  guests?: AdminGuestFilter;
}

export type AdminUserListResponse = Paginated<"users", AdminUser> & {
  /** Only filled when the `guests` filter is sent; otherwise null. */
  guestSummary: AdminGuestSummary | null;
};

export interface UpdateUserStatusPayload {
  status: UserAccountStatus;
  reason?: string;
}

export interface UpdateUserStatusResponse extends AdminUser {
  storeSuspended: boolean | null;
}
