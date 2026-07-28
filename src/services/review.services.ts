import { api } from "../lib/axios";
import { ApiResponse } from "../types/api";
import { CreateReviewPayload, Review } from "../types/review";

export const createReview = async (data: CreateReviewPayload) => {
  const response = await api.post<ApiResponse<Review>>("/reviews", data);
  return response.data;
};

export const updateReview = async (
  id: string,
  data: { rating?: number; comment?: string }
) => {
  const response = await api.patch<ApiResponse<Review>>(`/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/reviews/${id}`);
  return response.data;
};
