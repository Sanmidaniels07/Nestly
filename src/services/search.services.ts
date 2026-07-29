import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  QuickSearchResult,
  SearchByTypeItem,
  SearchByTypeParams,
  SearchResultType,
} from "../types/search";

export const quickSearch = async (q: string) => {
  const response = await api.get<ApiResponse<QuickSearchResult>>("/search", {
    params: { q },
  });
  return response.data;
};

export const searchByType = async <T extends SearchResultType>(
  type: T,
  params: SearchByTypeParams
) => {
  const response = await api.get<
    ApiResponse<Paginated<"items", SearchByTypeItem<T>>>
  >(`/search/${type}`, { params });
  return response.data;
};
