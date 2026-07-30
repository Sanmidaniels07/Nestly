export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  isFeatured?: boolean;
  productCount?: number;
  /** Platform commission for products in this category, as a percentage (10 = 10%). */
  commissionRate: number;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  isFeatured?: boolean;
  commissionRate?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
