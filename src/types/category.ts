export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  isFeatured?: boolean;
  productCount?: number;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  isFeatured?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
