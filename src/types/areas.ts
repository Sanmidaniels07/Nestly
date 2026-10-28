// GET /seo/areas - neighbourhoods / LGAs with sellers based in or
// delivering to them, by state.
export interface AreaCategory {
  slug: string;
  productCount: number;
}

export interface Area {
  name: string;
  storeCount: number;
  productCount: number;
  updatedAt: string;
  categories: AreaCategory[];
}

export interface AreaIndex {
  states: { name: string; areas: Area[] }[];
}

// GET /seo/areas/sellers
export interface AreaSeller {
  name: string;
  slug: string;
  logo: string | null;
  rating: number;
  totalSales: number;
  isVerified: boolean;
  city: string | null;
  state: string | null;
  productCount: number;
  reviewCount: number;
  // Based in the area (rather than delivering to it).
  basedHere: boolean;
}

export interface AreaSellers {
  state: string;
  area: string;
  total: number;
  sellers: AreaSeller[];
}
