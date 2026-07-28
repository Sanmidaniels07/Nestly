export type CouponType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
}

export interface UpdateCouponPayload {
  value?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export interface CouponListParams {
  page?: number;
  limit?: number;
}

export interface ValidateCouponResult {
  valid: boolean;
  discountAmount: number;
  coupon: {
    code: string;
    type: CouponType;
    value: number;
  };
}
