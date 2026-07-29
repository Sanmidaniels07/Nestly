import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { TwoFactorSetupData } from "../types/auth";

export const setupTwoFactor = async () => {
  const response = await api.post<ApiResponse<TwoFactorSetupData>>(
    "/2fa/setup"
  );
  return response.data;
};

export const verifyTwoFactorSetup = async (token: string) => {
  const response = await api.post<ApiResponse<{ message: string }>>(
    "/2fa/verify",
    { token }
  );
  return response.data;
};

export const disableTwoFactor = async (token: string) => {
  const response = await api.post<ApiResponse<{ message: string }>>(
    "/2fa/disable",
    { token }
  );
  return response.data;
};
