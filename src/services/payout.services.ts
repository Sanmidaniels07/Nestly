import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreatePayoutPayload,
  HeldPayoutsOverview,
  MyPayouts,
  Payout,
  PayoutListParams,
  PayoutRunResult,
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

// ---- Hold-then-pay -----------------------------------------------------------

// Seller: what's coming, when, and what's been paid.
export const getMyPayouts = async () => {
  const response = await api.get<ApiResponse<MyPayouts>>("/seller/payouts");
  return response.data;
};

// Admin: money held per seller and failed transfers.
export const getHeldPayouts = async () => {
  const response = await api.get<ApiResponse<HeldPayoutsOverview>>("/admin/payouts/held");
  return response.data;
};

// Admin: record paying a seller's ready orders by hand.
export const payHeldManually = async (storeId: string, note?: string) => {
  const response = await api.post<ApiResponse<Payout>>(`/admin/payouts/held/${storeId}/pay`, { note });
  return response.data;
};

// Admin: run payouts now.
export const runPayouts = async () => {
  const response = await api.post<ApiResponse<PayoutRunResult>>("/admin/payouts/run");
  return response.data;
};
