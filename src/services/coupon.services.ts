import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  Coupon,
  CouponListParams,
  CreateCouponPayload,
  UpdateCouponPayload,
  ValidateCouponResult,
} from "../types/coupon";

export const createCoupon = async (data: CreateCouponPayload) => {
  const response = await api.post<ApiResponse<Coupon>>("/coupons", data);
  return response.data;
};

export const getCoupons = async (params: CouponListParams) => {
  const response = await api.get<ApiResponse<Paginated<"coupons", Coupon>>>(
    "/coupons",
    { params }
  );
  return response.data;
};

export const updateCoupon = async (id: string, data: UpdateCouponPayload) => {
  const response = await api.patch<ApiResponse<Coupon>>(`/coupons/${id}`, data);
  return response.data;
};

export const validateCoupon = async (code: string) => {
  const response = await api.post<ApiResponse<ValidateCouponResult>>(
    "/coupons/validate",
    { code }
  );
  return response.data;
};
