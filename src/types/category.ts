export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  isFeatured?: boolean;
  productCount?: number;
  /** Platform commission for products in this category, as a percentage (10 = 10%). */
  commissionRate: number;
  /** Food, cakes, groceries: 24 hours to report a problem (with a photo) instead of 3 days. */
  isPerishable?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  isFeatured?: boolean;
  commissionRate?: number;
  isPerishable?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
