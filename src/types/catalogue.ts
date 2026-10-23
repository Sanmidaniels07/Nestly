// GET /seo/catalogue - categories with live products and where they're sold.
export interface CatalogueState {
  name: string;
  productCount: number;
  updatedAt: string;
}

export interface CatalogueCategory {
  slug: string;
  name: string;
  icon: string | null;
  isFeatured: boolean;
  productCount: number;
  updatedAt: string | null;
  states: CatalogueState[];
}

export interface Catalogue {
  categories: CatalogueCategory[];
}
