import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { ProductCondition } from "../types/product";
import { DeliveryVehicle } from "../lib/delivery-vehicle";

// Photo-to-listing (POST /api/products/ai-draft): suggested listing details
// from photos the seller already uploaded. Nothing is saved by the API.

export interface AiListingStatus {
  enabled: boolean;
  remainingToday: number;
}

export interface PriceGuide {
  low: number;
  high: number;
  basedOn: number;
}

export interface AiListingDraft {
  title: string;
  description: string;
  categoryId: string | null;
  categoryName: string | null;
  brand: string;
  condition: ProductCondition;
  deliveryVehicle: DeliveryVehicle;
  highlights: string[];
  specifications: { name: string; value: string }[];
  priceGuide: PriceGuide | null;
  remainingToday: number;
}

export const getAiListingStatus = async () => {
  const response = await api.get<ApiResponse<AiListingStatus>>("/products/ai-draft/status");
  return response.data.data;
};

export const createAiListingDraft = async (imageUrls: string[]) => {
  const response = await api.post<ApiResponse<AiListingDraft>>("/products/ai-draft", { imageUrls });
  return response.data.data;
};
