// GET /seller/dashboard/customer-map - where a store's customers are.
export interface CustomerMapArea {
  area: string;
  count: number;
  // The store delivers there (named in a zone, or a flat-rate zone covers it).
  delivers: boolean;
  // The store shows on that area's public Nestly pages.
  listed: boolean;
}

export interface CustomerMapState {
  state: string;
  count: number;
  delivers: "all" | "some" | "none";
  // Counted in the state but in an area Nestly doesn't recognise.
  otherAreas: number;
  areas: CustomerMapArea[];
}

export interface CustomerMapTally {
  total: number;
  // No recognisable state.
  unknown: number;
  states: CustomerMapState[];
}

export interface CustomerMap {
  days: number;
  orders: CustomerMapTally;
  interested: CustomerMapTally;
}
