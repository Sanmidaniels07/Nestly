import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { Address, CreateAddressPayload, UpdateAddressPayload } from "../types/address";

export const createAddress = async (data: CreateAddressPayload) => {
  const response = await api.post<ApiResponse<Address>>("/addresses", data);
  return response.data;
};

export const getAddresses = async () => {
  const response = await api.get<ApiResponse<Address[]>>("/addresses");
  return response.data;
};

export const updateAddress = async (id: string, data: UpdateAddressPayload) => {
  const response = await api.patch<ApiResponse<Address>>(`/addresses/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/addresses/${id}`);
  return response.data;
};
