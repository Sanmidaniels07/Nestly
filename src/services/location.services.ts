import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { DetectedLocation, NigerianState, StateLocations } from "../types/location";

export const getNigerianStates = async () => {
  const response = await api.get<ApiResponse<NigerianState[]>>("/locations/states");
  return response.data;
};

export const getStateLocations = async (state: string) => {
  const response = await api.get<ApiResponse<StateLocations>>(
    `/locations/states/${encodeURIComponent(state)}`
  );
  return response.data;
};

export const detectStateFromCoords = async (lat: number, lng: number) => {
  const response = await api.get<ApiResponse<DetectedLocation>>("/locations/reverse", {
    params: { lat, lng },
  });
  return response.data;
};
