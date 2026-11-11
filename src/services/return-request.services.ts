import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  BuyerReturnAction,
  CreateReturnRequestPayload,
  ReturnDecision,
  ReturnRequest,
  ReturnRequestListParams,
  SellerReturnAction,
} from "../types/return-request";

export const createReturnRequest = async (data: CreateReturnRequestPayload) => {
  const response = await api.post<ApiResponse<ReturnRequest>>("/returns", data);
  return response.data;
};

export const getReturnRequests = async (params: ReturnRequestListParams) => {
  const response = await api.get<ApiResponse<Paginated<"returns", ReturnRequest>>>("/returns", { params });
  return response.data;
};

export const getSellerReturnRequests = async (params: ReturnRequestListParams) => {
  const response = await api.get<ApiResponse<Paginated<"returns", ReturnRequest>>>("/returns/seller", { params });
  return response.data;
};

// Seller: refund, send a replacement, or disagree (Nestly decides).
export const respondToReturnRequest = async (id: string, action: SellerReturnAction, note?: string) => {
  const response = await api.post<ApiResponse<ReturnRequest>>(`/returns/${id}/respond`, { action, note });
  return response.data;
};

// Buyer: keep the item, confirm the replacement, or report a problem with it.
export const buyerReturnAction = async (id: string, action: BuyerReturnAction, note?: string) => {
  const response = await api.post<ApiResponse<ReturnRequest>>(`/returns/${id}/buyer-action`, { action, note });
  return response.data;
};

// Admin: open reports (disputes first) and refunds to send by hand.
export const getAdminReturnRequests = async (params: ReturnRequestListParams) => {
  const response = await api.get<ApiResponse<Paginated<"returns", ReturnRequest>>>("/returns/admin", { params });
  return response.data;
};

export const decideReturnRequest = async (id: string, decision: ReturnDecision, note?: string) => {
  const response = await api.post<ApiResponse<ReturnRequest>>(`/returns/${id}/decide`, { decision, note });
  return response.data;
};
