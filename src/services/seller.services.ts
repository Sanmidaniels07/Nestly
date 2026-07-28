import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { BecomeSellerPayload, SellerProfile } from "../types/seller";

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

export const updateMySeller = async (data: BecomeSellerPayload) => {
  const response = await api.patch<ApiResponse<SellerProfile>>(
    "/seller/me",
    data
  );
  return response.data;
};
