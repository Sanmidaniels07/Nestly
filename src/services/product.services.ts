import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  CreateProductPayload,
  MyProductParams,
  NearbyProductParams,
  Product,
  ProductListParams,
  UpdateProductPayload,
} from "../types/product";
import { Review } from "../types/review";

export const createProduct = async (data: CreateProductPayload) => {
  const response = await api.post<ApiResponse<Product>>("/products", data);
  return response.data;
};

export const getProducts = async (params: ProductListParams) => {
  const response = await api.get<ApiResponse<Paginated<"products", Product>>>(
    "/products",
    { params }
  );
  return response.data;
};

export const getFeaturedProducts = async (limit?: number) => {
  const response = await api.get<ApiResponse<Product[]>>(
    "/products/featured",
    { params: { limit } }
  );
  return response.data;
};

export const getNearbyProducts = async (params: NearbyProductParams) => {
  const response = await api.get<ApiResponse<Paginated<"products", Product>>>(
    "/products/nearby",
    { params }
  );
  return response.data;
};

export const getMyProducts = async (params: MyProductParams) => {
  const response = await api.get<ApiResponse<Paginated<"products", Product>>>(
    "/products/me",
    { params }
  );
  return response.data;
};

export const getMyProduct = async (id: string) => {
  const response = await api.get<ApiResponse<Product>>(`/products/me/${id}`);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
};

export const getRelatedProducts = async (id: string, limit?: number) => {
  const response = await api.get<ApiResponse<Product[]>>(
    `/products/${id}/related`,
    { params: { limit } }
  );
  return response.data;
};

export const getProductReviews = async (
  id: string,
  params: { page?: number; limit?: number }
) => {
  const response = await api.get<ApiResponse<Paginated<"reviews", Review>>>(
    `/products/${id}/reviews`,
    { params }
  );
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductPayload) => {
  const response = await api.patch<ApiResponse<Product>>(
    `/products/${id}`,
    data
  );
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
  return response.data;
};
