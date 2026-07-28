export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export type Paginated<TKey extends string, TItem> = {
  [K in TKey]: TItem[];
} & {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
