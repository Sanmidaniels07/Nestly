import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { DetectedLocation, NigerianState, PlaceSuggestion, StateLocations } from "../types/location";

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

export const searchPlaces = async (q: string, limit = 8) => {
  const response = await api.get<ApiResponse<PlaceSuggestion[]>>("/locations/search", {
    params: { q: q || undefined, limit },
  });
  return response.data;
};

export const detectStateFromCoords = async (lat: number, lng: number) => {
  const response = await api.get<ApiResponse<DetectedLocation>>("/locations/reverse", {
    params: { lat, lng },
  });
  return response.data;
};
