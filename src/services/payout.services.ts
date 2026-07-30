import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreatePayoutPayload,
  Payout,
  PayoutListParams,
  StorePayoutInfo,
} from "../types/payout";

export const createPayout = async (data: CreatePayoutPayload) => {
  const response = await api.post<ApiResponse<Payout>>(
    "/admin/payouts",
    data
  );
  return response.data;
};

export const getPayouts = async (params: PayoutListParams) => {
  const response = await api.get<ApiResponse<Paginated<"payouts", Payout>>>(
    "/admin/payouts",
    { params }
  );
  return response.data;
};

export const getStorePayoutInfo = async (storeId: string) => {
  const response = await api.get<ApiResponse<StorePayoutInfo>>(
    `/admin/payouts/stores/${storeId}/info`
  );
  return response.data;
};
