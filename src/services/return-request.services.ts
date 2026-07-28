import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreateReturnRequestPayload,
  ReturnRequest,
  ReturnRequestListParams,
  ReturnRequestStatus,
} from "../types/return-request";

export const createReturnRequest = async (data: CreateReturnRequestPayload) => {
  const response = await api.post<ApiResponse<ReturnRequest>>(
    "/returns",
    data
  );
  return response.data;
};

export const getReturnRequests = async (params: ReturnRequestListParams) => {
  const response = await api.get<ApiResponse<Paginated<"returns", ReturnRequest>>>(
    "/returns",
    { params }
  );
  return response.data;
};

export const getSellerReturnRequests = async (params: ReturnRequestListParams) => {
  const response = await api.get<ApiResponse<Paginated<"returns", ReturnRequest>>>(
    "/returns/seller",
    { params }
  );
  return response.data;
};

export const updateReturnRequestStatus = async (
  id: string,
  status: ReturnRequestStatus
) => {
  const response = await api.patch<ApiResponse<ReturnRequest>>(
    `/returns/${id}/status`,
    { status }
  );
  return response.data;
};
