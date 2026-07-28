"use client";

import { useQuery } from "@tanstack/react-query";

import { getCoupons } from "../services/coupon.services";
import { CouponListParams } from "../types/coupon";

export const useCoupons = (params: CouponListParams = {}) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCoupons(params),
    select: (response) => response.data,
  });
};
