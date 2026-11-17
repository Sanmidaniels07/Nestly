import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { BecomeSellerPayload, QuickStartSellerPayload, SellerProfile, SellerReadiness } from "../types/seller";

export const becomeSeller = async (data: BecomeSellerPayload) => {
  const response = await api.post<ApiResponse<SellerProfile>>(
    "/seller/become-seller",
    data
  );
  return response.data;
};

export const getMySeller = async () => {
  const response = await api.get<ApiResponse<SellerProfile>>("/seller/me");
  return response.data;
};

export const getMySellerReadiness = async () => {
  const response = await api.get<ApiResponse<SellerReadiness>>("/seller/me/readiness");
  return response.data;
};

export const updateMySeller = async (data: BecomeSellerPayload) => {
  const response = await api.patch<ApiResponse<SellerProfile>>(
    "/seller/me",
    data
  );
  return response.data;
};

// A live store in one step (reviewed by Nestly afterwards).
export const quickStartSeller = async (data: QuickStartSellerPayload) => {
  const response = await api.post<ApiResponse<SellerProfile>>("/seller/quick-start", data);
  return response.data;
};
