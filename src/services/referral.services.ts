import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { ReferralStats } from "../types/referral";

export const getMyReferralStats = async () => {
  const response = await api.get<ApiResponse<ReferralStats>>("/referrals/me");
  return response.data;
};
